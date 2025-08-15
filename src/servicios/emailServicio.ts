import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `Tu Empresa <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log('Correo enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo de recuperación.');
    }
};