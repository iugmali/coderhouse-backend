import { Router } from 'express';
import passport from "passport";
import {sendPasswordChangedEmail, sendPasswordResetEmail} from "../lib/services/mail.service.js";
import {userService} from "../factory/user.factory.js";
import TokenModel from "../dao/models/token.model.js";
import {createHash, generateCode, isValidHash} from "../lib/util.js";
import {BASE_URL} from "../config/config.js";

const router = Router();

router.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect('/products');
  }
  res.render('signup');
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/signupfail'
}));

router.get('/signupfail', (req, res) => {
  req.logger.warning('Falha no registro');
  res.render('signup', {message: 'Dados inválidos ou email já existe'});
});

router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/products');
  }
  res.render('login');
});

router.get('/loginfail', (req, res) => {
  req.logger.warning('Falha no login');
  res.render('login', {message: 'Credenciais inválidas'});
});

router.post('/login', passport.authenticate('login', {
  failureRedirect: '/loginfail'
}), async (req, res) => {
  if (!req.user) return res.status(400).json({error: 'Credenciais invalidas'});
  req.session.user = {
    id: req.user._id.toString(),
    first_name: req.user.first_name,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cart,
    last_connection: req.user.last_connection,
  };
  res.redirect('/products');
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    req.session.user = {
      id: req.user._id.toString(),
      first_name: req.user.first_name,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart,
      last_connection: req.user.last_connection,
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
    const token = await TokenModel.findOne({ userId: user._id });
    if (token) await token.deleteOne();
    const resetToken = generateCode();
    const hash = createHash(resetToken);
    await TokenModel.create({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    });
    const link = `${BASE_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    await sendPasswordResetEmail(user.email, link);
    res.render('forgot-password', {message: 'Email para redefinição de senha enviado com sucesso'});
  } catch (e) {
    req.logger.error(e.message);
    res.render('forgot-password', {message: 'Email não encontrado em nossa base de dados'});
  }
});

router.get('/reset-password', async (req, res) => {
  const { token, id } = req.query;
  const userToken = await TokenModel.findOne({ userId: id });
  if (!userToken) {
    res.render('forgot-password', {message: 'Token inválido ou expirado. Digite seu e-mail para receber um novo token.'});
    return;
  }
  const isValid = await isValidHash(token, userToken.token);
  if (!isValid) {
    res.render('forgot-password', {message: 'Token inválido ou expirado. Digite seu e-mail para receber um novo token.'});
    return;
  }
  res.render('reset-password', { token, id });
});

router.post('/reset-password', async (req, res) => {
  const {token, id, password} = req.body;
  try {
    const userToken = await TokenModel.findOne({ userId: id });
    if (!userToken) {
      res.render('forgot-password', {message: 'Token inválido ou expirado. Digite seu e-mail para receber um novo token.'});
      return;
    }
    const isValid = await isValidHash(token, userToken.token);
    if (!isValid) {
      res.render('forgot-password', {message: 'Token inválido ou expirado. Digite seu e-mail para receber um novo token.'});
      return;
    }
    const user = await userService.getUserById(id);
    const isSamePassword = await isValidHash(password, user.password);
    if (isSamePassword) {
      res.render('reset-password', { token, id, message: 'Senha não pode ser igual a anterior. Digite uma nova senha.' });
      return;
    }
    const hash = createHash(password);
    user.password = hash;
    await user.save();
    await sendPasswordChangedEmail(user.email);
    await userToken.deleteOne();
    res.render('login', {message: 'Senha alterada com sucesso. Faça login com a nova senha.'});
  } catch (e) {
    res.status(500).json({message: e.message});
  }
});

export default router;
