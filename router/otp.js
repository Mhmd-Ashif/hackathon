const router = require("express").Router();
const sendOtp = require("../function.js");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

const secret = "i love cricket";

const createToken = (email, otp, val) => {
  return jwt.sign({ email, otp }, secret, {
    expiresIn: val || "5m",
  });
};

router.get("/sendotp/:email", async (req, res) => {
  console.log("ji");
  console.log(req.params);
  const email = req.params.email;
  console.log(email);

  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log(otp);

  try {
    const response = await sendOtp(email, otp);
    console.log(response);
    if (response.includes("email is sent!!!")) {
      const token = createToken(email, otp, "5m");
      console.log(token);
      res.status(200).json({ token });
    } else {
      res.status(500).json("error sending otp!!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("server error!!");
  }
});

router.post("/verifyotp", async (req, res) => {
  console.log(req.body);

  if (req.body.token) {
    try {
      const verfication = jwt.verify(req.body.token, secret, (err, decoded) => {
        if (err) {
          res.status(500).json({ msg: "error otp!!" });
        } else {
          if (req.body.value == decoded.otp) {
            res.status(200).json("valid otp!!");
          } else {
            console.log(req.body.value);
            console.log(decoded.otp);
            res.status(400).json("invalid otp!!");
          }
        }
      });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("otp expired!!");
  }
});

module.exports = router;
