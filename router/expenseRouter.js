const { Router } = require("express");
const { createExpense, getOwnerExpense, getAllExpense } = require("../controller/expenseController");
const { authorize } = require("../middleware/authorize");

const expenseRouter = Router()

expenseRouter.route('/all-exp').get(getAllExpense)
expenseRouter.route('/').get(authorize,getOwnerExpense)
expenseRouter.route('/create').post(authorize,createExpense)

module.exports = {expenseRouter}