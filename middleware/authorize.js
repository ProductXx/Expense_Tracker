const { Unauthorized, Forbidden } = require("../util/AppError");
const { tryCatch } = require("../util/TryCatch");
const jwt = require("jsonwebtoken");

exports.authorize = tryCatch(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new Unauthorized("Unauthorized!!");
  }

  //   console.log(token);
  const pureToken = token.split(" ")[1];

  jwt.verify(pureToken, process.env.JWT_SECRET, (err, decodedToken) => {
    //     console.log(decodedToken);af

    if (err) throw new Forbidden("Invalid Access token !!");
    // console.log(decodedToken.userId);
    req.activeUserId = decodedToken.userId;
  });

  next();
});
