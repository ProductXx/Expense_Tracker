const { Router } = require("express");
const {
  getUser,
  editUser,
  deleteUser,
  registerUser,
  loginUser,
} = require("../controller/userController");
const { authorize } = require("../middleware/authorize");

const userRouter = Router();

userRouter.route("/").get(getUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/edit").put(editUser);
userRouter.route("/delete").delete(authorize,deleteUser);

module.exports = { userRouter };
