const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");


app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("staticFiles"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const mobileNumber = req.body.phoneNumber;
    const birthDate = req.body.birthDate;
    const postalAddress = req.body.postalAddress;

    // follow mailchimp api documentation for this 
    // this is the structure of json which mailchimp accepts (in json string format)

    const data = {
        members:[{
            email_address: email,
            status:"subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName,
                MOBNUMBER: mobileNumber,
                ADDRESS: postalAddress,
                BIRTHDATE: birthDate,
            }
        }]
    }

    const jsonData = JSON.stringify(data);
    // api key
    const apiKey = "edb56b34cd14c42ed7b2ad533457a387-us6";
    // list id  - because we can have multiple lists on mailchimp
    const list_id = "dc4820ac27";

    const url = 'https://us6.api.mailchimp.com/3.0/lists/'+list_id;

    const options = {
        method: "POST",
        auth: "deshabhakt:"+apiKey,
    }

    const request = https.request(url,options,function(response){
        response.on("data",(data)=>{
           if(response.statusCode===200){
               res.sendFile(__dirname+"/success.html");
           }
           else{
               res.sendFile(__dirname+"/failure.html")
           }
        })
    });

    request.write(jsonData);
    request.end();

})

// with this command heroku can dynamically decide on which port on client side should our website run
// || 3000 ---> app will run on port 3000 when running locally

const portNumber = process.env.PORT || 3000;

app.listen(portNumber,function(){
    console.log("Server started on port " + portNumber)
})

