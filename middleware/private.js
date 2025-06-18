const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @module middleware/private
 * @description
 * Middleware Express pour vérifier la validité d'un token JWT.
 *
 * Vérifie la présence d'un token JWT dans les headers, cookies ou authorization.
 * Valide le token avec la clé secrète.
 * Renouvelle le token et met à jour le cookie et le header Authorization.
 * En cas d'absence ou invalidité du token, renvoie une erreur 401.
 *
 * @requires jsonwebtoken - Librairie de gestion JWT
 */

exports.checkJWT = async (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.cookies?.access_token;

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  if (!token) {
    return res.status(401).json("token_required");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json("token_not_valid");
    }

    req.email = decoded.email;

    const expiresIn = 24 * 60 * 60;
    const newToken = jwt.sign({ email: decoded.email }, SECRET_KEY, {
      expiresIn,
    });

    res.cookie("access_token", newToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: expiresIn * 1000,
    });

    res.setHeader("Authorization", "Bearer " + newToken);

    next();
  });
};
