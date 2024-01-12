const axios = require("axios")
const Data = require("models/Data")
const User = require("models/User")
const {DataSchema} = require('validations/data')
const { generateRequestId } = require("helpers/airtimeRecharge")


// TO GET DATA SUBSCRIPTION VARIATION CODES
exports.getDataVariationCodes = async (req, res) => {
    try {
      const { selectedNetwork } = req.body;
      console.log("SELECTED NETWORK=>", selectedNetwork);
  
      let vtPassApiUrl;
      let vtPassApiKey;
      let vtPassSecretKey;
      let vtPassPublicKey;
  
      if (selectedNetwork === 'mtn-data') {
        vtPassApiUrl = process.env.VTPASS_VARIATION_CODES1_API_URL
        vtPassApiKey = process.env.VTPASS_API_KEY;
        vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
        vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;
      } else if (selectedNetwork === 'airtel-data') {
        vtPassApiUrl = process.env.VTPASS_VARIATION_CODES2_API_URL
        vtPassApiKey = process.env.VTPASS_API_KEY;
        vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
        vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;
      } else if (selectedNetwork === 'glo-data') {
        vtPassApiUrl = process.env.VTPASS_VARIATION_CODES3_API_URL
        vtPassApiKey = process.env.VTPASS_API_KEY;
        vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
        vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;
      } else if (selectedNetwork === 'eisalat-data') {
        vtPassApiUrl = process.env.VTPASS_VARIATION_CODES4_API_URL
        vtPassApiKey = process.env.VTPASS_API_KEY;
        vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
        vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;
      } else {
        return res.status(400).json({
            errors: [
              {
                error: "Invalid network selection",
              },
            ],
          });
      }
  
      const vtPassApiResponse = await axios.get(
        vtPassApiUrl,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': vtPassApiKey,
            'secret-key': vtPassSecretKey,
            'public-key': vtPassPublicKey,
          },
        }
      );
  
      if (vtPassApiResponse.data.response_description === '000') {
        return res.status(200).json({message: vtPassApiResponse.data.content.varations});
      } else {
        return res.status(400).json({ message: "Failed to fetch data variations" });
      }
      
    } catch (error) {
      console.error('DATA VARIATION CODES ERROR=>', error);
      res.status(500).json({
        errors: [
          {
            error: "Server Error",
          },
        ],
      });
    }
  };
  
  
// TO BUY AIRTIME BY USING VTPASS API
exports.dataSubscription = async(req, res) => {
    const {id} = req.user
    const user = await User.find({user:id})
    if(!user){
        return res.status(404).json({
            errors: [{
                error: "User not found",
            }, ],
        });
    }

    const body = DataSchema.safeParse(req.body)
    
    if(!body.success) {
        return res.status(400).json({errors: body.error.issues})
    }

    try{
        const dataOrder = await Data.create({
            user: id,
            requestId: generateRequestId(),
            ...body.data,
        })

        const requestId = generateRequestId();
        
        // TO MAKE THE CALL TO VTPASS ENDPOINTS AND BUY THE Data.
        const vtPassApiUrl = process.env.VTPASS_API_URL

        const vtPassApiKey= process.env.VTPASS_API_KEY
        const vtPassSecretKey = process.env.VTPASS_SECRET_KEY
        const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY

        const vtPassApiResponse = await axios.post(
            vtPassApiUrl,
            {
                serviceID: body.data.network,
                amount: body.data.amount,
                billersCode: body.data.phoneNumber,
                phone: body.data.phoneNumber,
                variation_code: body.data.selectDataPlan,
                request_id: requestId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": vtPassApiKey,
                    "secret-key": vtPassSecretKey,
                    "public-key": vtPassPublicKey,
            }
        }
        
        )
        const transactionId = vtPassApiResponse.data.content.transactions.transactionId;

        // Update the order status and transaction details in the database
        if(vtPassApiResponse.data.response_description == 'TRANSACTION SUCCESSFUL'){
            dataOrder.status = 'delivered';
            dataOrder.transactionId = transactionId;
            dataOrder.requestId = requestId
             }else if(vtPassApiResponse.data.code == '016'){
                dataOrder.transactionId = transactionId;
            dataOrder.status = 'failed';           
        }

        await dataOrder.save();
    //TODO
    // Send a confirmation email to the user

    if (dataOrder.status === 'delivered') {
        return res.status(200).json({ message: vtPassApiResponse.data});
    } else {
        return res.status(400).json({ message: vtPassApiResponse.data.response_description });
    }
    } catch (error) {
        console.error('DATA SUBSCRIPTION ERROR=>', error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
            },
          ],
        });
      }

   
}