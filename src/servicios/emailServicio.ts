import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Esta línea ignora la validación de certificados
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Puedes usar otro servicio de correo como SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                <h2 style="color: #333;">Recuperación de Contraseña</h2>
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para verificar tu identidad:</p>
                <h3 style="background-color: #f0f0f0; padding: 10px; text-align: center; letter-spacing: 5px;">${token}</h3>
                <p>Este código es válido por solo <strong>1 hora</strong>.</p>
                <p>Si no solicitaste este cambio, por favor ignora este correo. Tu contraseña no será modificada.</p>
                <p>Saludos,<br>El equipo de tu aplicación</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo de recuperación enviado exitosamente.');
    } catch (error) {
        console.error('Error al enviar el correo de recuperación:', error);
        throw new Error('Error al enviar el correo de recuperación');
    }
};