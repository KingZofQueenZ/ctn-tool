const config = require('../config/index');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const smtpConfig = config.mailer.connectionString;

const email = new Email({
    views: { 
        root: './server/templates',
        options: {
            extension: 'ejs'
        }
    }
});

exports.sendMail = function(template, locals ) {
    const transporter = nodemailer.createTransport(smtpConfig);

    email.render('registration', locals)
        .then((result) => {
            const emailOptions = {
                from: config.mailer.defaultFromAddress,
                to: locals.email,
                subject: locals.subject,
                html: result
            }
            console.log('Success');
            /*transporter.sendMail(emailOptions, (err, data) => {
                console.log(data);
                console.log(err);
            })*/

            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
}
