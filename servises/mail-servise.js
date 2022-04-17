const nodemailer = require('nodemailer');

class MailService{

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use SSL
            auth: {
                user: 'abbos.d97@gmail.com',
                pass: 'abbos.3013'
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Accountni faollashtiring ' + process.env.API_URL,
            text:'',
            html:
                `<div>
                    <h1>Faollashtirish linki</h1>
                    <a href="${link}">${link}</a>
                </div>`
        })
    }

}

module.exports = new MailService();