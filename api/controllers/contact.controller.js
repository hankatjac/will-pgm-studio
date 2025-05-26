import transporter from "../config/nodemailer.js";

export const contactUs = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;

  const mail = {
    from: name,
    to: "info@exel-tech.com, patrick@exel-tech.com",
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Phone: ${phone}</p>
             <p>Message: ${message}</p>`,
  };

  transporter.sendMail(mail, (error) => {
    if (error) {
      res.send("Message failed to send");
    } else {
      res.send("Message Sent");
    }
  });
};

export const willpgmContact = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const message = req.body.message;

  const mail = {
    from: "patrick@exel-tech.com",
    to: "hangryan@gmail.com",
    subject: "Contact Form Submission",
    html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Phone: ${phone}</p>
             <p>Message: ${message}</p>`,
  };

  transporter.sendMail(mail, (error) => {
    if (error) {
      res.send("Message failed to send");
    } else {
      res.send("Message Sent");
    }
  });
};
