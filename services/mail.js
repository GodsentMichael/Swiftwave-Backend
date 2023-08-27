const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun.client({
  username: DOMAIN,
  key: API_KEY,
});

// NOTE: html and template can't be passed at the same time

const sendMail = async (data) => {
  const { from, to, subject, params, ...props } = data;

  const messageBody = {
    from: from ?? "Swiftwave <no-reply@swiftwave.com.ng>",
    to,
    subject,
  };

  for (const values in props) {
    if (props[values]) {
      messageBody[values] = props[values];
    }
  }

  if (params) {
    messageBody["h:X-Mailgun-Variables"] = JSON.stringify({ ...params });
  }

  try {
    const message = await mg.messages.create(DOMAIN, messageBody);

    await message;
    return { data: true };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong", message: err.details };
  }
};

module.exports = {
  sendMail,
};
