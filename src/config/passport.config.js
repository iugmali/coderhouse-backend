import passport from 'passport';
import {Strategy as GithubStrategy} from 'passport-github2';
import {Strategy as LocalStrategy} from 'passport-local';
import { isValidPassword, createHash } from '../lib/util.js';
import {cartService} from "../factory/cart.factory.js";
import {userService} from "../factory/user.factory.js";


const initializePassport = () => {
  passport.use('github', new GithubStrategy({
    clientID: process.env.GITHUB_LOGIN_CLIENT_ID,
    clientSecret: process.env.GITHUB_LOGIN_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_LOGIN_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.getUserByEmail(profile._json.email);
      if (!user.cart) {
        const cart = await cartService.addCart({});
        await userService.addCartToUser(user.email, cart._id);
        user.cart = cart._id;
      }
      return done(null, user);
    } catch (error) {
      try {
        const userFields = {
          first_name: profile._json.name,
          email: profile._json.email,
          role: 'user',
          password: ''
        }
        const result = await userService.createUser(userFields);
        const cart = await cartService.addCart({});
        await userService.addCartToUser(user.email, cart._id);
        result.cart = cart._id;
        return done(null, result);
      } catch (error) {
        return done(error);
      }
    }
  }));

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    const { first_name, last_name, age } = req.body;
    const hashedPassword = createHash(password);
    const userFields = {
      first_name,
      last_name,
      age,
      email,
      role: 'user',
      password: hashedPassword
    };
    try {
      const user = await userService.createUser(userFields);
      const cart = await cartService.addCart({});
      await userService.addCartToUser(user.email, cart._id);
      user.cart = cart._id;
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
      if (!user.cart) {
        const cart = await cartService.addCart({});
        await userService.addCartToUser(user.email, cart._id);
        user.cart = cart._id;
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
