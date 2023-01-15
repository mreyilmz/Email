const express = require("express");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("static"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.API_SERVER
});

app.post("/", function(req, res) {
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const listID = process.env.LIST_ID

    const subscribingUser = {
        firstName: fName,
        lastName: lName,
        email: email
    };
       //Uploading the data to the server
    async function run() {const response = await mailchimp.lists.addListMember(listID, {
         email_address: subscribingUser.email,
         status: "subscribed",
         merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
        });
        //If all goes well logging the contact's id
         res.sendFile(__dirname + "/success.html")
         console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }
        //Running the function and catching the errors (if any)
        // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
    

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
