const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userRouter = require("./router/user");

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("Your app is running port 3000");
});
