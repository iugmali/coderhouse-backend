import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;

export default sgMail;
