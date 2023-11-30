import jwt from "jsonwebtoken";
export const authentication = (req, res, next) => {
  console.log("starting authentication");
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(403);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err, token);
      return res.status(403).json({ isValid: false, token });
    }
    req.user = user;
    console.log("user", user);
    console.log("user authenticated");
    next();
  });
};
