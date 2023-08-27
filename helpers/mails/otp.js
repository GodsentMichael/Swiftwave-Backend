/* eslint-disable max-len */
const createAccountOtp = (otp) => {
    return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

          <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
              <tr>
                  <td style="text-align: center;">
                  <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> SWIFTWAVE.</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; margin: 20px 0;">
                      <p style="font-size: 24px; font-weight: bold;">Email OTP Verification</p>
                      <p style="color: #475467; font-size: 16px;"> This OTP is valid for 30 minutes. Please do not share this code with anyone.</p>
                      <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">${otp}</div>
                      <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you signed up for a Swiftwave account. If you did not sign up for an account, please ignore this email.</p>
                
                  </td>
              </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2023 Swiftwave. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                  </td>
              </tr>
          </table>
      
      </body>`;
};

module.exports = {
    createAccountOtp
};
