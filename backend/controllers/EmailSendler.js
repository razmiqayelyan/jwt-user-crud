import nodemailer from "nodemailer";

export const sendEmailtoUser = async(link, email, username) => {

    let transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
    });
    
      let info = await transporter.sendMail({
        from:  'no-reply@mikayelyan.website', // sender address
        to: `${email}`, // list of receivers
        subject: `Email Confirmation`, // Subject line
        text: `Hello ${username}`, // plain text body
        html: `
        <p>You can verify your email by opening this url: <a href=${process.env.DOMAIN}/api/user/confirmation/${link}> <b>Link</b></a></p>
        `, // html body
      });
    }
  
// export const verifyPassword = async(link, email, username) => {

//       let transporter = nodemailer.createTransport({
//         host: "smtp.titan.email",
//         port: 465,
//         secure: true, // true for 465, false for other ports
//         auth: {
//           user: process.env.EMAIL_USER, // generated ethereal user
//           pass: process.env.EMAIL_PASS, // generated ethereal password
//         },
//       });
      
//         let info = await transporter.sendMail({
//           from:  'no-reply@mikayelyan.website', // sender address
//           to: `${email}`, // list of receivers
//           subject: `Reset Password`, // Subject line
//           text: `Hello ${username}`, // plain text body
//           html: `
//           <p>You can reset your password by opening this url: <a href=${process.env.DOMAIN}/api/user/confirmation/${link}> <b>Link</b></a></p>
//           `, // html body
//         });
//       }