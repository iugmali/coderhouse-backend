export const checkAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}

export const checkAuthJson = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({error: 'Unauthorized'});
}

export const checkAdminJson = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(401).json({error: 'Unauthorized'});
}
