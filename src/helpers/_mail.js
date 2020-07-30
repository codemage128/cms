import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import ejs from 'ejs';
import fs from 'fs';
import Settings from '../models/settings';

const readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) callback(err);
        else callback(null, html);
    });
};

module.exports = async (subject, to, html, replace, siteUrl, callback) => {
    let set = await Settings.findOne();

    // Gmail Config
    let gmailAuth = {
        type: 'oauth2',
        user: set.email.config.gmail.username,
        clientId: set.email.config.gmail.clientId,
        clientSecret: set.email.config.gmail.clientSecret,
        refreshToken: set.email.config.gmail.refreshToken,
    };

    const gmailSmtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: gmailAuth
    });

    // Sendgrid Config
    const sendgridSmtpTransport = nodemailer.createTransport({
        service: 'sendgrid',
        auth: {
            user: set.email.config.sendgrid.username,
            pass: set.email.config.sendgrid.password
        }
    });

    // SMTP config
    const smtpTransport = nodemailer.createTransport({
        host: set.email.config.smtp.host,
        port: set.email.config.smtp.port,
        secure: true,
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: set.email.config.smtp.username,
            pass: set.email.config.smtp.password
        }
    });

    // Aws Config
    AWS.config.update({
        accessKeyId: set.email.config.aws.accessKeyId,
        secretAccessKey: set.email.config.aws.secretAccessKey,
        region: set.email.config.aws.region
    });

    // create Nodemailer SES transporter
    let transporter = nodemailer.createTransport({
        SES: new AWS.SES({
            apiVersion: '2010-12-01'
        })
    });

    switch (set.email.provider) {
        case 'gmail':
            readHTMLFile(__dirname + `/../views/email-templates/${html}.html`, (err, html) => {
                const template = ejs.compile(html);
                const replacements = replace;
                const htmlToSend = template(replacements);
                const mailOptions = {
                    to: to,
                    from: `${set.siteName} no-reply@${siteUrl}`,
                    subject: subject,
                    html: htmlToSend,
                    sender: `no-reply@${siteUrl}`,
                    replyTo: `no-reply@${siteUrl}`,
                };
                gmailSmtpTransport.sendMail(mailOptions, (err, info) => {
                    if (err) callback(err);
                    else callback(null, info);
                });
            });
            break;
        case 'sendgrid':
            readHTMLFile(__dirname + `/../views/email-templates/${html}.html`, (err, html) => {
                const template = ejs.compile(html);
                const replacements = replace;
                const htmlToSend = template(replacements);
                const mailOptions = {
                    to: to,
                    from: `${set.siteName} <no-reply@${siteUrl}>`,
                    subject: subject,
                    html: htmlToSend,
                    sender: `no-reply@${siteUrl}`,
                    replyTo: `no-reply@${siteUrl}`,
                };
                sendgridSmtpTransport.sendMail(mailOptions, (err, info) => {
                    if (err) callback(err);
                    else callback(null, info);
                });
            });
            break;
        case 'smtp':
            readHTMLFile(__dirname + `/../views/email-templates/${html}.html`, (err, html) => {
                const template = ejs.compile(html);
                const replacements = replace;
                const htmlToSend = template(replacements);
                const mailOptions = {
                    to: to,
                    from: `${set.siteName} <no-reply@${siteUrl}>`,
                    subject: subject,
                    html: htmlToSend,
                    sender: `no-reply@${siteUrl}`,
                    replyTo: `no-reply@${siteUrl}`,
                };
                smtpTransport.sendMail(mailOptions, (err, info) => {
                    if (err) callback(err);
                    else callback(null, info);
                });
            });
            break;
        case 'aws':
                readHTMLFile(__dirname + `/../views/email-templates/${html}.html`, (err, html) => {
                    const template = ejs.compile(html);
                    const replacements = replace;
                    const htmlToSend = template(replacements);
                    const mailOptions = {
                        to: to,
                        from: `${set.siteName} <no-reply@${siteUrl}>`,
                        subject: subject,
                        html: htmlToSend,
                        sender: `no-reply@${siteUrl}`,
                        replyTo: `no-reply@${siteUrl}`,
                    };
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) callback(err);
                        else callback(null, info);
                    });
                });
            break;
        default: break
    };
};