const mongoose = require("mongoose");
const { number } = require("zod");

mongoose.connect(
  "mongodb+srv://routebuddy:routebuddy2024@cluster0.0m2b7g4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const userSchema = new mongoose.Schema({
  userName: String,
  firstName: String,
  lastName: String,
  password: String,
  accId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
});

const accountSchema = new mongoose.Schema({
  accountNumberEncoded: String,
  balance: Number,
});

// Define a schema for the sub-document
const coordSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

// Define the main schema
const postSchema = new mongoose.Schema({
  coords: [
    {
      latitude: Number,
      longitude: Number,
    },
  ],
  departureTime: String,
  duration: String,
  endPoint: String,
  startPoint: String,
  totalDistance: String,
  seats: Number,
  postIdUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = {
  User,
  Account,
  Post,
};
