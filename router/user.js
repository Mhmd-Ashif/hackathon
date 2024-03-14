const express = require("express");
const router = express.Router();
const { User, Account, Post } = require("../db");
const z = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/middleware");
const otp = require("./otp");

router.use("/otp", otp);

router.post("/signup", async function (req, res) {
  const data = req.body;
  const Schemaup = z.object({
    userName: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
  });
  if (Schemaup.safeParse(data).success) {
    const ifPresent = await User.findOne({
      userName: data.userName,
    });
    if (ifPresent) {
      res.json({
        message: "Email Already taken",
      });
    } else {
      await User.create(data);

      res.status(200).json({
        message: "user created successfully",
      });
    }
  } else {
    res.status(411).json({
      message: "Wrong inputs",
    });
  }
});

router.post("/signin", async function (req, res) {
  const data = req.body;
  const Schemain = z.object({
    userName: z.string().email(),
    password: z.string(),
  });
  if (Schemain.safeParse(data).success) {
    const ifPresent = await User.findOne({
      userName: data.userName,
      password: data.password,
    });
    if (ifPresent) {
      const userId = ifPresent._id;
      const token = "Bearer " + jwt.sign({ userId }, JWT_SECRET);
      res.json({
        token,
      });
    } else {
      res.json({
        message: "sry cant provide jwt token for unvalid users",
      });
    }
  } else {
    res.json({
      message: "wrong inputs",
    });
  }
});

router.post("/account", authMiddleware, async function (req, res) {
  const id = req.decodedVal;
  const data = req.body;

  const SchemaAcc = z.object({
    accountNumberEncoded: z.string().min(12),
  });
  if (SchemaAcc.safeParse(data).success) {
    const balance = Math.round(Math.random() * 1000) + 1;
    const encoded = jwt.sign({ data }, JWT_SECRET);
    const acc = await Account.create({
      accountNumberEncoded: encoded,
      balance,
    });

    await User.updateOne(
      {
        _id: id.userId,
      },
      {
        $set: { accId: acc._id },
      }
    );

    res.json({
      msg: "updated successfully",
    });
  } else {
    res.json({
      msg: "wrong inputs",
    });
  }
});

router.post("/post", authMiddleware, async function (req, res) {
  const data = req.body;
  const id = req.decodedVal;

  const coordinateSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
  });

  const schemaPost = z.object({
    coords: z.array(coordinateSchema),
    departureTime: z.string(),
    duration: z.string(),
    endPoint: z.string(),
    startPoint: z.string(),
    totalDistance: z.string(),
    seats: z.number(),
  });

  if (schemaPost.safeParse(data).success) {
    const post = await Post.create({
      coords: data.coords,
      departureTime: data.departureTime,
      duration: data.duration,
      endPoint: data.endPoint,
      startPoint: data.startPoint,
      totalDistance: data.totalDistance,
      seats: data.seats,
      postIdUser: id.userId,
    });
    if (Post.findOne({ postIdUser: post.postIdUser })) {
      res.json({
        msg: "sorry you can post only one ride",
      });
    } else {
      res.json({
        msg: "post successfully created",
      });
    }
  } else {
    res.json({ msg: "Invalid inputs" });
  }
});

router.put("/delete", authMiddleware, async function (req, res) {
  try {
    const id = req.decodedVal;
    console.log(id);
    if (id) {
      const result = await Post.deleteOne({
        postIdUser: id.userId,
      });
      if (result.deletedCount > 0) {
        res.json({
          msg: "post successfully deleted",
        });
      } else {
        res.json({
          msg: "No matching posts found for deletion",
        });
      }
    } else {
      res.json({
        msg: "invalid inputs",
      });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      msg: "An error occurred while deleting the post",
    });
  }
});

module.exports = router;
