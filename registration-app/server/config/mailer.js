const config = require('../config/index');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const smtpConfig = config.mailer.connectionString;
const path = require('path');

const email = new Email({
    views: { 
        root: (path.join(__dirname, '../../templates')),
        options: {
            extension: 'ejs'
        }
    }
});

exports.sendMail = function(template, locals) {
    const transporter = nodemailer.createTransport(smtpConfig);

    email.render(template, locals)
        .then((result) => {
            const emailOptions = {
                from: config.mailer.defaultFromAddress,
                to: locals.email,
                subject: locals.subject,
                html: result
            }
            transporter.sendMail(emailOptions, (err, data) => {
                if (!err) {
                    return true;
                }

                console.log(err);
                return false;
            })

            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
}

exports.sendContactForm = function(locals) {
    const transporter = nodemailer.createTransport(smtpConfig);
    const htmlMessage = 'Nachricht von: ' + locals.email + '</br> Name: ' + locals.name + '</br>' + locals.message;
    const emailOptions = {
        from: config.mailer.defaultFromAddress,
        to: locals.emailTo,
        subject: locals.subject,
        text: locals.message,
        html: htmlMessage
    }
    transporter.sendMail(emailOptions, (err, data) => {
        if (!err) {
            return true;
        }

        console.log(err);
        return false;
    })

    return true;
}
