import { Router } from 'express';
import passport from "passport";

const router = Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/login',
  failureRedirect: '/signupfail'
}));

router.get('/signupfail', (req, res) => {
  res.send({ error: 'Falha no registro' });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/loginfail', (req, res) => {
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

export default router;
