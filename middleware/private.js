const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

exports.checkJWT = async (req, res, next) => {

  let token = req.headers['x-access-token']
           || req.headers['authorization']
           || req.cookies?.access_token;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    return res.status(401).json('token_required');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json('token_not_valid');
    }

    req.decoded = decoded;

    const expiresIn = 24 * 60 * 60;
    const newToken = jwt.sign({ user: decoded.user }, SECRET_KEY, { expiresIn });


    res.cookie('access_token', newToken, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: expiresIn * 1000
    });

    res.setHeader('Authorization', 'Bearer ' + newToken);

    next();
  });
};
