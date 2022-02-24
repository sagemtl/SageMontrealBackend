import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Contact endpoint
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  var content = `name: ${name} \n email: ${email} \n subject: ${subject} \n message: ${message}`;

  const mail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: subject,
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res
        .status(200)
        .send({ message: 'Contact email sent successfully', data });
    }
  });
});

export default router;
