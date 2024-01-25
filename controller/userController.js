const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { tryCatch } = require("../util/TryCatch");
const { BadRequest, NotFound } = require("../util/AppError");
const jwt = require("jsonwebtoken");
const { getUserCollection } = require("../services/dbService");
const { existUser } = require("../services/userService");

exports.getUser = tryCatch(async (req, res) => {
  const collection = await getUserCollection();

  const result = await collection.find({}).toArray();
  // console.log(req)
  res.status(200).json({ message: true, data: result });
  // console.log(result);
});

exports.registerUser = tryCatch(async (req, res) => {
  const collection = await getUserCollection();

  const { name, email, password, con_password, phone } = req.body;

  const users = await collection.find({}).toArray();

  const existUser = users.find((us) => us.email === email);

  // VALIDATION
  if (existUser) {
    throw new BadRequest("Email already exist !!");
  } else if (!name || !email || !password || !con_password) {
    throw new BadRequest("Fill all of this field !!");
  } else if (!email.includes("@")) {
    throw new BadRequest("email is not definied!");
  } else if (password.length < 5) {
    throw new BadRequest("Length must have at least 5!");
  } else if (password !== con_password) {
    throw new BadRequest("password and confirm password does not match !!");
  }

  // for store hash passwod -
  const hashPassword = bcrypt.hashSync(password, 5);

  const newUserData = {
    name,
    email,
    password: hashPassword,
    phone,
  };

  // console.log(newUserData);
  const result = await collection.insertOne(newUserData);

  res.status(201).json({ message: "Created successfully !", data: result });
});

exports.loginUser = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Email and Password are required!");
  }

  const existLoginUser = await existUser(email, password);
  
  if (!existLoginUser) {
    throw new BadRequest("Invalid password or email !!");
  }

  var token = jwt.sign({ userId: existLoginUser._id }, process.env.JWT_SECRET);
  // console.log("id", existLoginUser._id);
  res
    .status(200)
    .json({ message: "Login Successfully!!", token, data: existLoginUser });
});

exports.editUser = tryCatch(async (req, res) => {
  const collection = await getUserCollection();

  const { _id, ...updateFields } = req.body;
  // console.log(req.body)
  // console.log(ObjectId.isValid(_id))
  if (!ObjectId.isValid(_id)) {
    throw new NotFound(`Id ${_id} is not exist !!`);
  }
  const id = new ObjectId(_id);

  // console.log(updateFields);
  const result = await collection.updateOne(
    { _id: id },
    { $set: updateFields },
    { new: true }
  );
  // console.log(result);

  res.status(200).json({ message: "Updated Successfully!", data: result });
});

exports.deleteUser = tryCatch(async (req, res) => {
  const collection = await getUserCollection();

  const {
    activeId,
    body: { confirm_word },
  } = req;

  console.log(activeId);

  const _id = new ObjectId(activeId);

  const user = await collection.findOne({ _id });

  // console.log(user);

  if (!user) {
    throw new NotFound("User does not exits!");
  } else if (confirm_word !== `delete/${user.name}`) {
    throw new BadRequest("It can't delete without confirm word!");
  }

  const result = await collection.deleteOne({ _id });
  console.log(result);
  if (result.acknowledged === true) {
    return res.status(200).json({ message: "Delete Successfully" });
  }
});
