const moment = require('moment-timezone');
const crypto = require('crypto');

const generateRandomAlphanumeric = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
    // console.log('result =>', result);
  }
  return result;
}

const generateRequestId = () => {
  // Set the timezone to Africa/Lagos (GMT+1)
  const lagosTimezone = 'Africa/Lagos';
  
  // Get the current date and time in the Africa/Lagos timezone
  const currentTime = moment().tz(lagosTimezone);
  
  // Format the date and time as YYYYMMDDHHII
  const formattedTime = currentTime.format('YYYYMMDDHHmm');
  
  // Generate a random suffix of 10 characters
  const randomSuffix = generateRandomAlphanumeric(10);
  
  // Concatenate the numeric date and time with the random suffix
  const requestId = formattedTime + randomSuffix;
//   console.log('request_id =>', requestId)
  
  return requestId;
}

// Example usage:
const requestId = generateRequestId();
console.log('request_id =>', requestId);

module.exports = {
    generateRequestId,
}