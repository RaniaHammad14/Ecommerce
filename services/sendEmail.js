import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "raniahmohh@gmail.com",
      pass: "hjldccqbsmzbsfun",
    },
  });

  const info = await transporter.sendMail({
    from: '"Verification 👻" <raniahmohh@gmail.com>',
    to: to ? to : "",
    subject: subject ? subject : "Verification",

    html: html ? html : "", // html body
  });

  console.log("Message sent: %s", info.messageId);
};
export default sendEmail;
