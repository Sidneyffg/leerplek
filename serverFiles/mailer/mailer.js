const nodemailer = require("nodemailer")


const mailer = {
    transporter: nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "sidneysleerplek@gmail.com",
            pass: "ndqlsqqqkbyhczrs",
        },
    }),

    sendMail: async function (templateNum, mailTo, data) {
        let info = await this.transporter.sendMail({
            from: `"Sidney's leerplek" <sidneysleerplek@gmail.com>`,
            to: data.email, // list of receivers (seperate with ,)
            subject: "Verrify account",
            //text: "Bericht verstuurd van mijn node server:)",
            html:
                `<p>Click button to verify account!</p>
                <table width="100%" cellspacing="0" cellpadding="0">
  <tr>
      <td>
          <table cellspacing="0" cellpadding="0">
              <tr>
                  <td class=”button” bgcolor="#ED2939" style="border-radius: 2px;">
                      <a  class=”link” href="http://localhost:3000/verify?email=${encodeURIComponent(data.email)}&code=${encodeURIComponent(data.code)}" target="_blank" style="padding: 8px 12px;
                      border: 1px solid #ED2939;
                      border-radius: 2px;
                      font-family: Helvetica, Arial, sans-serif;
                      font-size: 14px;
                      color: #ffffff; S
                      text-decoration: none;
                      font-weight: bold;
                      display: inline-block;">
                          Click             
                      </a>
                  </td>
              </tr>
          </table>
      </td>
  </tr>
</table>
            `

        });
    }
}

module.exports = mailer;