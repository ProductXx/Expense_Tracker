const { getDb } = require("../db/mongodb");

const getCollection = async (collectionName) =>
  await getDb().collection(collectionName);

module.exports = {
  getUserCollection: () => getCollection("user"),
  getExpenseCollection: () => getCollection("expense"),
};
