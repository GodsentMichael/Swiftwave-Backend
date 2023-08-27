const bcrypt = require("bcrypt");

const encrypt = async (value) => {
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(value, salt);
};

const compare = async (newValue, existingValue) => {
  return await bcrypt.compare(newValue, existingValue);
};

module.exports = {
  encrypt,
  compare,
};

