import jwt from "jsonwebtoken";
import userModel from "../../connectionDB/models/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) {
        return res.status(401).json({ msg: "Token not provided" });
      }

      if (!token.startsWith("eco__")) {
        return res.status(401).json({ msg: "Invalid token" });
      }
      const newToken = token.split("eco__")[1];
      if (!newToken) {
        return res.status(401).json({ msg: "Token Not Found" });
      }
      const decoded = jwt.verify(newToken, "eco");
      if (!decoded?.id) {
        return res.status(401).json({ msg: "Invalid Payload" });
      }
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(400).json({ msg: "User Not Found" });
      }
      if (parseInt(user.passwordChangeAt?.getTime() / 1000) > decoded.iat) {
        return res.status(403).json({ msg: "Token Expired Please Login Again" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ msg: "Server Error", error: error.message, stack: error.stack });
    }
  };
};
//===================================================Authorization=========================================//

export const authorization = (roles = []) => {
  return async (req, res, next) => {
    try {
      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).json({ msg: "You Are Not Authorized" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ msg: "Server Error", error: error.message, stack: error.stack });
    }
  };
};
