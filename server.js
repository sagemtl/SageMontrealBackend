const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv/config");
const nodemailer = require('nodemailer');



// Import Routes
const inventory_routes = require('./routes/inventory');
const orders_routes = require('./routes/orders');
const ktv_routes = require('./routes/ktv');

// Middlewares
app.use(express.json());
app.use(cors());

// Routes Middleware
app.use('/inventory-api', inventory_routes);
app.use('/orders-api', orders_routes);
app.use('/ktv-api', ktv_routes);


// Contact endpoint
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  var content = `name: ${name} \n email: ${email} \n subject: ${subject} \n message: ${message}`;

  const mail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: subject,
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send({ message: 'Contact email sent successfully', data });
    }
  })
})

// PORT, Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));