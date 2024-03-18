/* eslint-disable max-len */
const createAccountOtp = (otp) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

          <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
              <tr>
                  <td style="text-align: center;">
                  <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> SWIFT.</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; margin: 20px 0;">
                      <p style="font-size: 24px; font-weight: bold;">Email OTP Verification</p>
                      <p style="color: #475467; font-size: 16px;"> This OTP is valid for 30 minutes. Please do not share this code with anyone.</p>
                      <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">${otp}</div>
                      <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you signed up for a Swiftvista account. If you did not sign up for an account, please ignore this email.</p>
                
                  </td>
              </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 Swiftvista. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                  </td>
              </tr>
          </table>
      
      </body>`;
};

const welcomeEmail = (userName) => {
    return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;"><table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
    <tr>
    <td style="text-align: left;">
    <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> SWIFT.</p>
    </td>
    </tr>
    <tr>
    <td style="text-align: left; margin: 20px 0;">
    <p style="font-size: 24px; font-weight: bold;">Welcome to Swiftvista, ${userName}!</p>
    <p style="color: #475467; font-size: 16px;">Thank you for choosing Swiftvista, the app that simplifies and streamlines utility bill payments and airtime/data purchases.</p>
    <p style="color: #475467; font-size: 16px;">Swiftvista is designed to provide a seamless and efficient platform for managing your essential services.</p>
    <p style="color: #475467; font-size: 16px;">With Swiftvista, you can easily pay your utility bills and purchase airtime/data at your convenience, all in one place.</p>
    <p style="color: #475467; font-size: 16px;">We are committed to enhancing your overall user experience and making the management of essential services hassle-free.</p>
    <p style="color: #475467; font-size: 16px;">If you have any questions or need assistance, our support team is ready to help.</p>
    </td>
    </tr>
    <tr>
    <td style="background-color: #F2F4F7; padding: 20px; text-align: left;">
    <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 Swiftvista. All rights reserved.</p>
    <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
    <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
    <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
    <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
    </td>
    </tr>
    
    </table> </body>`; }
  

/* eslint-disable max-len */
const resetPasswordOtp = (otp) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

          <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
              <tr>
                  <td style="text-align: center;">
                  <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> SWIFT.</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; margin: 20px 0;">
                      <p style="font-size: 24px; font-weight: bold;">Email OTP Verification</p>
                      <p style="color: #475467; font-size: 16px;"> This OTP is valid for 30 minutes. Please do not share this code with anyone.</p>
                      <div style="background-color: #F2F4F7; font-size: 24px; padding: 10px 30px; border-radius: 20px; display: inline-block;">${otp}</div>
                      <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you tried to change your Swiftvista account password. If you did not attempt any password change for your account, please ignore this email.</p>
                
                  </td>
              </tr>
              <tr>
                  <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
                       
                      <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 Swiftvista. All rights reserved.</p>
                      <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                      <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                  </td>
              </tr>
          </table>
      
      </body>`;
};

// Report acknpwledgement email
const reportSent = (username, complaintCategory, subject, email, description, imageUrl) => {
    return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">
  
      <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
          <tr>
              <td style="text-align: center;">
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> SWIFTVISTA.</p>
              </td>
          </tr>
          <tr>
              <td style="text-align: center; margin: 20px 0;">
                  <p style="font-size: 24px; font-weight: bold;">Swiftvista support</p>
                  <p style="color: #475467; font-size: 16px;"> Customer Complaint 📣.</p>
                  <p style="font-size: 12px; margin: 5px 0;"> A customer has reported an issue. Here are the details:.</p>
                  <ul style="list-style: none; padding: 0; margin: 10px 0;">
                  <li style="font-size: 14px; color: #475467;">Customer Name: ${username} </li>
                  <li style="font-size: 14px; color: #475467;">Email: ${email} </li>
                  <li style="font-size: 14px; color: #475467;">Subject: ${subject} </li>
                  <li style="font-size: 14px; color: #475467;">Complaint Category: ${complaintCategory} </li>
                  <li style="font-size: 14px; color: #475467;">Description: ${description}.</li>
                  <li style="font-size: 14px; color: #475467;">Image: <img src="${imageUrl}" alt="Customer Report Image" style="max-width: 100%;"></li>
              </ul>
            
              </td>
          </tr>
          <tr>
          <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
               
              <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 Swiftvista. All rights reserved.</p>
              <p style="font-size: 12px; margin: 5px 0;">Follow us</p>
              <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
              <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
              <img style="width: 20px; margin: 0 2px; display: inline-block;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
          </td>
      </tr>
  </table>
  
  </body>`;
};  

const reportReceived = (username) => {
  return `<body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

    <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
        <tr>
            <td style="text-align: center;">
            <p style="font-size: 12px; font-weight: bold; margin: 5px 0;"> SWIFTVISTA.</p>
            </td>
        </tr>
        <tr>
            <td style="text-align: center; margin: 20px 0;">
                <p style="font-size: 24px; font-weight: bold;">Hi 👋 ${username}</p>
                <p style="color: #475467; font-size: 16px;"> We have received your report and we are working on it. We will get back to you as soon as possible.</p>
                <p style="font-size: 12px; margin: 5px 0;">This email was sent to you because you reported an issue to us. If you did not report any issue, please ignore this email.</p>
          
            </td>
        </tr>
        <tr>
        <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">
             
            <p style="font-size: 12px; font-weight: bold; margin: 5px 0;">© 2024 Swiftvista. All rights reserved.</p>
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
  createAccountOtp,
  welcomeEmail,
  resetPasswordOtp,
  reportReceived,
  reportSent,
};
