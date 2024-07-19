import { Router } from 'express';
import passport from "passport";
import {sendPasswordResetEmail} from "../lib/services/mail.service.js";
import {userService} from "../factory/user.factory.js";
import TokenModel from "../dao/models/token.model.js";
import {createHash, generateCode} from "../lib/util.js";
import {BASE_URL} from "../config/config.js";

const router = Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/signupfail'
}));

router.get('/signupfail', (req, res) => {
  req.logger.warning('Falha no registro');
  res.send({ error: 'Falha no registro' });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/loginfail', (req, res) => {
  req.logger.warning('Falha no login');
  res.send({ error: 'Falha no login' });
});

router.post('/login', passport.authenticate('login', {
  failureRedirect: '/loginfail'
}), async (req, res) => {
  if (!req.user) return res.status(400).json({error: 'Credenciais invalidas'});
  req.session.user = {
    first_name: req.user.first_name,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cart
  };
  res.redirect('/products');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = {
      first_name: req.user.first_name,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart
    };
    res.redirect('/products');
});

router.get('/api/sessions/current', (req, res) => {
  res.json(req.session.user);
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.render('forgot-password-sent');
    }
    const token = await TokenModel.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    const resetToken = generateCode();
    const hash = createHash(resetToken);
    await TokenModel.create({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    });
    const link = `${BASE_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
    await sendPasswordResetEmail(user.email, link);
    res.render('forgot-password-sent');
  } catch (e) {
    req.logger.error(e.message);
    res.render('forgot-password-sent');
  }
});

router.get('/reset-password', (req, res) => {
  const { token, id } = req.query;
  res.render('reset-password', { token, id });
});

router.post('/reset-password', async (req, res) => {
  const {token, id, password} = req.body;
  try {
    const user = await userService.getUserById(id);
  } catch (e) {
    res.status(e.status).json({message: e.message});
  }
});

export default router;
