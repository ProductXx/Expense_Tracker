const express = require("express");
const { connectDb } = require("./db/mongodb");
const { userRouter } = require("./router/userRouter");
const errorHandler = require("./middleware/errorHandling");
const NotFound = require("./middleware/NotFound");
const { expenseRouter } = require("./router/expenseRouter");
const app = express();
const port = 6000;

connectDb()
  .then(() => {
    app.use(express.json());

    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/expense",expenseRouter)

    app.use(NotFound);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error, "Connection error!");
  });
