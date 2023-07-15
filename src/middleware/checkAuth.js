const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      error: 'Not authenticated.',
      status: 'error',
    });
  }

  next();
};

export default checkAuth;