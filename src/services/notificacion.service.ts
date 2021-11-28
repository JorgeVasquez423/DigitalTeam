import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Twilio} from "twilio";

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  enviarSMS() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const origen = process.env.TELEFONO_ORIGEN;
    try {
      if (accountSid && authToken && origen) {
        const client = new Twilio(accountSid, authToken);

        client.messages
          .create({
            from: origen,
            to: '+573128866019',
            body: 'You just sent an SMS from TypeScript using Twilio!',
          })
          .then(message => console.log(message.sid));
      } else {
        console.error(
          'You are missing one of the variables you need to send a message',
        );
      }
    } catch (error) {}
  }

  enviarEmail() {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
      if (sgMail) {
        const msg = {
          to: process.env.EMAIL_DESTINO, // Change to your recipient
          from: process.env.EMAIL_ORIGEN, // Change to your verified sender
          subject: 'Sending with SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        sgMail.send(msg);
        /*
        .then(res => {
          console.log(res[0].statusCode);
          console.log(res[0].headers);

        }) */
      } else {
        console.error('Error en el envío del Email');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
