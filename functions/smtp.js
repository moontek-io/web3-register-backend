/** https://nodemailer.com/smtp/ */

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASS, // generated ethereal password
  },
});

module.exports.getTemplate = (filename, body = {}) => {
  const emailTemplatePath = path.join(__dirname, '../', 'email-templates', filename);
  const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' });
  return ejs.render(template, body);
}

module.exports.send = async (email, subject, template) => {
  try {
    const options = {
      from: process.env.SMTP_FROM, // sender address
      to: email, // list of receivers
      subject: subject || 'Subject', // Subject line
      html: template, // html body
    }
    await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
  }
}