const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json("Authorization header is missing");
  }
  
  const token = authHeader.split(" ")[1];
  
  // Check if token exists
  if (!token) {
    return res.status(401).json("Token is missing");
  }
  
  jwt.verify(token, "secretcode" , (error, user) => {
    if (error) {
      return res.status(401).json("Invalid token or unauthorized");
    }
    // Attach user object to request for further processing
    req.user = user;
    // Call next middleware
    next();
  });
};

module.exports = auth;