import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import { isValidPassword, createHash } from '../lib/util.js';
import UserService from "../dao/services/db/user.service.js";
import User from "../dao/models/user.model.js";

const userService = new UserService(User);

const initializePassport = () => {
  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const { name } = req.body;
    const hashedPassword = createHash(password);
    const userFields = {
      name,
      email,
      role: 'user',
      password: hashedPassword
    };
    try {
      const user = await userService.createUser(userFields);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return done(null, false);
      }
      const isValid = await isValidPassword(user, password);
      if (!isValid) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user);
  });
};

export default initializePassport;
