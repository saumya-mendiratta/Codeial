const nodeMailer = require('../config/nodemailer');

//This is another way of exporting a method 
exports.newComment = (comment)=>{

    let htmlString = nodeMailer.renderTemplate({comment: comment} , './comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({

        from: 'saya.mendiratta@gmail.com',
        to : comment.user.email,
        subject: "New Comment Published !", 
        html: htmlString

    } , (err , info)=>{
        if(err){
            console.log("Error in sending mail" , err);
            return;
        }
        // console.log("Message sent" , info);
        return;
    });

}