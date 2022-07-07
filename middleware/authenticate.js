const jwt = require('jsonwebtoken');

/**
 * Middleware for authentication
 * @see https://www.npmjs.com/package/express-jwt
 */
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized',
    });
  }

  const token = authorization.split(' ').reverse()[0];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: `Unauthorized ${err.name}`,
      });
    }
    //console.log('decoded :: ',decoded);
    // NOTE: email is not present in the token
    const { me, email } = decoded;
    if (!me) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized Malformed JWT',
      });
    }
    // Make the decoded JWT payload available on the request object
    req.user = decoded;
    next();
  });
};
