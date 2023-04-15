let authorization = {};
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const auth = require("basic-auth");
var privKey = crypto.randomBytes(64).toString("hex");
authorization.keygen = function () {
  var rand = crypto.randomBytes(64).toString("hex");
  var token = jwt.sign({ data: rand }, privKey, { expiresIn: "1h" });
  return token;
};
authorization.authenticate = function (token) {
  if (jwt.verify(token, privKey)) {
    return true;
  } else {
    return false;
  }
};
authorization.validateToken = function (req) {
  try {
    this.authenticate(req.headers.authorization.split(" ")[1]);
  } catch (err) {
    return false;
  }
  return true;
};

authorization.auth = auth;
module.exports = authorization;
