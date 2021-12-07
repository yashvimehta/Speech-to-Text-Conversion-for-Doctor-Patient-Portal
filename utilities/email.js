const nodemailer = require("nodemailer");
// const appPassword=require("../configs/config").APP
const appPassword=process.env.APP
module.exports = async function (options) {
    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        //host: "smtp.gmail.com",
        auth: {
            user: "yashvi.mehta@spit.ac.in",
            pass: "yashaswiyashvi2978"
        }
    });
    let mailDetails = {
        from: "yashvi.mehta@spit.ac.in",
        to: options.recieversEmailId,
        subject: options.subject,
        attachments: [{
            filename: 'report.pdf',
            path: '/Users/yashvimehta/Downloads/report.pdf',
            //path: '/Users/91976/Downloads/report.pdf',
            contentType: 'application/pdf'
          }],
    };
    try {
        await mailTransporter.sendMail(mailDetails);
        console.log("Email was send")
    } catch (err) {
        console.log(err);
        console.log("Email could not be send");
        console.log(err);
    }
};
