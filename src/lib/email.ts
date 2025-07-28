import nodemailer from 'nodemailer';

export const trimiteEmailComanda = async (destinatar: string, subiect: string, continutHtml: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LastBite" <${process.env.EMAIL_USER}>`,
    to: destinatar,
    subject: subiect,
    html: continutHtml,
  });
};

export const trimiteEmailCodRidicare = async (
  destinatar: string,
  numeClient: string,
  nrComanda: string,
  codRidicare: string
) => {
  const linkVerificare = `${process.env.APP_URL}/ridicare/${codRidicare}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkVerificare)}`;

  const html = `
    <h3>Bună, ${numeClient}!</h3>
    <p>Comanda ta <strong>${nrComanda}</strong> este gata de ridicat.</p>
    <p>Codul tău de ridicare este: <strong>${codRidicare}</strong></p>
    <p>Scanează codul QR la restaurant sau accesează linkul de verificare:</p>
    <img src="${qrUrl}" alt="Cod QR pentru ridicare" />
    <p><a href="${linkVerificare}">Verifică comanda</a></p>
    <br/>
    <p>Mulțumim că salvezi mâncarea cu LastBite! 🌱</p>
  `;

  await trimiteEmailComanda(destinatar, 'Comanda gata de ridicare', html);
}
export const trimiteEmailConfirmareComanda = async (
  destinatar: string,
  numeClient: string,
  nrComanda: string
) => {
  const html = `
    <h3>Bună, ${numeClient}!</h3>
    <p>Comanda ta <strong>${nrComanda}</strong> a fost <strong>confirmată</strong> de restaurant.</p>
    <p>Te vom anunța imediat ce este gata de ridicare.</p>
    <br/>
    <p>Mulțumim că salvezi mâncarea cu LastBite! 🌱</p>
  `;

  await trimiteEmailComanda(destinatar, 'Comandă Confirmată - LastBite', html);
};




