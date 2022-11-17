const nodemailer = require("nodemailer")
// const mailgun = require("mailgun-js")
// const cloudinairy = require("cloudinary")

// cloudinairy.config({
//     cloud_name: 'djvpxkf34',
//     api_key: '864894247674969',
//     api_secret: 'UdJNjiICGoegmeTkuXlL-t25c-8'
// });
module.exports = ({
    genrateOtp: () => {
        let random = Math.random()
        let otp = Math.floor(random * 100000) + 100000
        return otp
    },
    uploadImage1: async (img) => {
        let imageRes = await cloudinairy.v2.uploader.upload(img);
        if (imageRes) {
            return imageRes.secure_url;
        }
        else {
            console.log("Image upload error")
        }
    },
    sendMailing: async (email, subject, text) => {
        try {
            console.log('27 ==>',email, subject, text)
            let transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: true,
                auth: {
                    user: "no-replymailer@mobiloitte.com",
                    pass: "%FEy=9FF@",

                },
            })

            // const DOMAIN = 'sandboxe86145a2a7f44a7cb4d649ba665c77e1.mailgun.org';
            // const api_key = "0e29748ed8173e3827409209236695b5-b0ed5083-e2b0f069";
            // const mg = mailgun({apiKey: api_key, domain: DOMAIN});

            // const data = {
            //     from: 'no-replymailer@mobiloitte.com>',
            //     to:email,
            //     subject: subject,
            //     text: text,
            //     // html:`http//:${req.headers.host}/verify email   `
            // };

            let options = {
                from: "no-replymailer@mobiloitte.com",
                to: email,
                subject: subject,
                text: text,
            }
            // let admin = {
            //     from: "no-replymailer@mobiloitte.com",
            //     to: "sharmag@mailinator.com",
            //     subject: subject,
            //     text: text,
            // }
            return await transporter.sendMail(options)
            // mg.messages().send(data,function(err,res){
            //     console.log(res)
            // })

        } catch (error) {
            console.log(error)
        }
    }
})