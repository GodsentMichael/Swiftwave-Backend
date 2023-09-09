const axios = require("axios")
const Airtime = require("models/Airtime")
const {AirtimeSchema} = require('validations/airtime')
const { generateRequestId } = require("helpers/airtimeRecharge")

// To buy airtime by using the vtpass API.
exports.airtimeRecharge = async(req, res) => {
    const body = AirtimeSchema.safeParse(req.body)
    
    if(!body.success) {
        return res.status(400).json({errors: body.error.issues})
    }

    try{

        const airtimeOrder = await Airtime.create({
            ...body.data,
        })

        const requestId = generateRequestId();
        console.log('request_id =>', requestId)
        
        //To make the call to vtpass endpoints and buy the airtime.
        const vtPassApiUrl = process.env.VTPASS_API_URL
        console.log("vtPassApiUrl =>", vtPassApiUrl)

        const vtPassApiKey= process.env.VTPASS_API_KEY
        const vtPassSecretKey = process.env.VTPASS_SECRET_KEY
        const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY
        console.log("vtPassApiKey =>", vtPassApiKey)
        console.log("vtPassSecretKey =>", vtPassSecretKey)
        console.log("vtPassPublicKey =>", vtPassPublicKey)
        const vtPassApiResponse = await axios.post(
            vtPassApiUrl,
            {
                serviceID: body.data.network,
                amount: body.data.amount,
                phone: body.data.phoneNumber,
                request_id: requestId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // "Authorization": `Bearer ${vtPassApiKey}`,
                    "api-key": vtPassApiKey,
                    "secret-key": vtPassSecretKey,
                    "public-key": vtPassPublicKey,
            }
        }
        
        )
        console.log('VT Pass API Response=>', vtPassApiResponse.data);
        const transactionId = vtPassApiResponse.data.content.transactions.transactionId;
        console.log('transactionId=>', transactionId);

        // Update the order status and transaction details in your database
        if(vtPassApiResponse.data.response_description == 'TRANSACTION SUCCESSFUL'){
            airtimeOrder.status = 'delivered';
            airtimeOrder.transactionId = transactionId;
             }else if(vtPassApiResponse.data.code == '016'){
                airtimeOrder.transactionId = transactionId;
            airtimeOrder.status = 'failed';           
        }

        await airtimeOrder.save();
    //TODO
    // Send a confirmation email to the user

    if (airtimeOrder.status === 'delivered') {
        return res.status(200).json({ message: vtPassApiResponse.data.response_description });
    } else {
        return res.status(400).json({ message: vtPassApiResponse.data.response_description });
    }
    }catch(error){
        console.error('Recharge Airtime Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

   
}

// Sandbox VT Pass API Key
// 4e1612cf6892295194b7d8d5ec1fa6e3

// Sandbox VT Pass Secret Key
// SK_97968a275cd2b734468f85b28a9880c697a0a1d768b

// Sandbox VT Pass Private Key
// PK_8271aa952342fec770931cc01932d9e08fa887ff302

// https://sandbox.vtpass.com/api/