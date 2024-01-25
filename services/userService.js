const bcrypt = require("bcrypt");
const { getUserCollection } = require("./dbService");

// get detail data
const existUser = async (email, password) => {
  const userCollection = await getUserCollection();
  const users = await userCollection.find({}).toArray();

  const existLoginUser = users.find(
    (us) => us.email === email && bcrypt.compareSync(password, us.password)
  );
  return existLoginUser || false;
};

const acitveUser = async (_id) => {
  const userCollection = await getUserCollection();
  const result = await userCollection.find({ _id }).toArray();

  return result || false;
};

module.exports = { existUser, acitveUser };
