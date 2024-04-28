import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as toml from '@iarna/toml';

interface Config {
    url: string;
    searchString: string;
    recipientEmail: string;
    user: string;
    pass: string;
    from: string;
    subject: string;
    service : string
    message : string
}

async function loadConfig(): Promise<Config> {
    const configFileContents = fs.readFileSync('./config.toml', 'utf-8');
    const config = toml.parse(configFileContents);
    return config as unknown as Config;
}


async function sendAlertEmail(config: Config): Promise<void> {
    try {
        const transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.user,
                pass: config.pass 
            }
        });

        const mailOptions = {
            from: config.from,
            to: config.recipientEmail,
            subject: config.subject,
            text: config.message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        transporter.close();

        });
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

async function main() {
    const config = await loadConfig();

    sendAlertEmail(config);

}

main();
