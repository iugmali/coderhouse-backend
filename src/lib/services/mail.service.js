import sgMail from '../../config/mail.config.js';

export const sendPasswordResetEmail = async (email, resetLink) => {
  const msg = {
    to: email,
    from: 'noreply@iugmali.com', // Use the email address or domain you verified above
    subject: 'CoderStore - Redefinir Senha',
    text: `Copie o link e cole na barra de endereço do seu navegador: ${resetLink}`,
    html: `<p>Clique no link abaixo para redefinir a sua senha</p><a href="${resetLink}">Redefinir senha</a>`,
  };
  try {
    await sgMail.send(msg);
  } catch (e) {
    e.statusCode = 500;
    e.message = 'Erro ao enviar email';
    throw e;
  }
}
