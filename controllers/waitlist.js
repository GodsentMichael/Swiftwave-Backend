const Waitlist = require('../models/Waitlist');
const sendEmail = require("../services/email");

exports.joinWaitlist = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the email already exists in the waitlist
      const existingEntry = await Waitlist.findOne({ email });
  
      if (existingEntry) {
        return res.status(400).json({ message: 'Email already in the waitlist' });
      }
  
      // Create a new entry in the waitlist
      await Waitlist.create({ email });
      console.log("Email added")

      // Send thank-you email
      const emailData = {
        to: email,
        subject: 'Thank You for Joining SwiftWave Waitlist',
        text: 'Dear user,\n\nThank you for joining the SwiftWave waitlist! We appreciate your interest and will keep you updated.\n\nBest regards,\nThe SwiftWave Team',
        html:`
        <body style="margin: 0; padding: 0; background-color: #F2F4F7; font-family: Arial, sans-serif;">

            <table style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #FFFFFF; padding: 20px;">
                <tr>
                    <td style="text-align: center;">
                        <p style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #475467;">SWIFTWAVE.</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center; margin: 20px 0;">
                        <p style="font-size: 24px; font-weight: bold; color: #475467;">Thank You for Joining SwiftWave Waitlist</p>
                        <p style="font-size: 16px; color: #475467;">We're thrilled to have you on board.</p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color: #F2F4F7; padding: 20px; text-align: center;">

                        <p style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #475467;">© 2023 Swiftwave. All rights reserved.</p>
                        <p style="font-size: 12px; margin: 5px 0; color: #475467;">Follow us</p>
                        <img style="width: 20px; margin: 0 5px; vertical-align: middle;" src="https://img.freepik.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg" alt="Instagram">
                        <img style="width: 20px; margin: 0 5px; vertical-align: middle;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png" alt="LinkedIn">
                        <img style="width: 20px; margin: 0 5px; vertical-align: middle;" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="Twitter">
                    </td>
                </tr>
            </table>

        </body>
  `
      };

      await sendEmail(emailData);
      console.log('Thank-you email sent to:', email);
      
      return res.status(201).json({ message: 'Added to the waitlist successfully' });
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.emailList = async (req, res) => {
    try {
      // Get the waitlist
      const waitlist = await Waitlist.find();
  
      res.status(200).json(waitlist);
    } catch (error) {
      console.error('Error getting waitlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deleteEmail = async (req, res) => {
    const emailId = req.params.id;

    try {
        // Check if the user exists
        const email = await Waitlist.findById(emailId);

        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Delete the user
        await Waitlist.findByIdAndDelete(emailId);

        res.status(200).json({ message: 'Email deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}