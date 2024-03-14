const Mailgen = require("mailgen");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendOtp = async (email, otp) => {
  console.log("enter function");
  let config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  };
  console.log(process.env.EMAIL);
  console.log(process.env.APP_PASSWORD);

  const transporter = nodemailer.createTransport(config);

  console.log("enter function 3 ");

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "RECRUITLINK",
      link: "https://mailgen.js/",
      copyright: "Copyright © 2016 RecruitLink. All rights reserved.",
    },
  });

  let response = {
    body: {
      name: "User",
      intro: [
        `ONE TIME PASSWORD FOR EMAIL VERIFICATION IN RouteBuddy`,
        `your otp is ${otp}`,
      ],
      outro: "Thanky You for Your Interest..",
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: email,
    subject: "One Time Password for RECRUITLINK",
    html: mail,
  };

  console.log(message);

  try {
    await transporter.sendMail(message);
    return "Email is not sent!!";
  } catch (err) {
    return "email is sent!!!";
  }
};

module.exports = sendOtp;
