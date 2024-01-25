const { ObjectId } = require("mongodb");
const { tryCatch } = require("../util/TryCatch");
const { getExpenseCollection } = require("../services/dbService");
const { acitveUser } = require("../services/userService");
const { BadRequest } = require("../util/AppError");

exports.getAllExpense = tryCatch(async (req, res) => {
  const collection = await getExpenseCollection();

  const result = await collection
    .aggregate([
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      { $unwind: "$ownerData" },
      {
        $project: {
          _id: 1,
          title: 1,
          amount: 1,
          currency: 1,
          notes: 1,
          date: 1,
          categoryId: 1,
          ownerName: "$ownerData.name",
          ownerId: "$ownerData._id",
        },
      },
    ])
    .toArray();

  res
    .status(200)
    .json({ message: "Here's all expense get have some fun!", data: result });
});

exports.getOwnerExpense = tryCatch(async (req, res) => {
  const collection = await getExpenseCollection();
  const { activeUserId } = req;

  const ownerExpense = await acitveUser(new ObjectId(activeUserId));
  if (!ownerExpense) {
    throw new BadRequest("You are not the owner of these expense!");
  }

  const result = await collection
    .aggregate([
      { $match: { userId: new ObjectId(activeUserId) } },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          title: 1,
          amount: 1,
          currency: 1,
          notes: 1,
          date: 1,
          categoryId: 1,
          ownerId: "$userDetails._id",
          ownerEmail: "$userDetails.email",
          ownerName: "$userDetails.name",
        },
      },
    ])
    .toArray();

  console.log(ownerExpense);
  res.status(200).json({ message: "Here's all expense!", data: result });
});

exports.createExpense = tryCatch(async (req, res) => {
  const collection = await getExpenseCollection();
  const {
    activeUserId,
    body: { title, amount, currency, notes, date, categoryId },
  } = req;

  let expenseData = {
    userId: new ObjectId(activeUserId),
    title,
    amount,
    currency,
    notes,
    date,
    categoryId,
  };

  const result = await collection.insertOne(expenseData);

  res.status(201).json({ message: "Your expense is created!", data: result });
});
