export const InvitationEmailTemplate = (email, password) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Welcome to RentPrompts</title>
  <link rel="preload" as="image" href="https://pub-9991e1a416ba46d0a4bef06e046435a1.r2.dev/image.png" />
  <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#ffffff;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;padding:0px">

  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:650px;margin:0 auto;background-color:#ffffff;padding:35px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);text-align:left">
    <tbody>
      <tr>
        <td>
          <!-- Logo Section -->
          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="text-align:center;margin-bottom:30px">
            <tbody>
              <tr>
                <td><img alt="RentPrompts" height="auto" src="https://pub-9991e1a416ba46d0a4bef06e046435a1.r2.dev/image.png" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto" width="180" /></td>
              </tr>
            </tbody>
          </table>


          <!-- Greeting -->
          <p style="font-size:20px;line-height:24px;margin:16px 0;margin-bottom:16px;color:#555">Hi There,</p>

          <p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#555">To get the most out of your experience, please visit your account with the credentials below:</p>
          <p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#555">Here are your login credentials:</p><p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#333;background-color:#f4f4f4;padding:10px;border-radius:5px"><strong>Email:</strong> <!-- -->${email}<!-- --> <br/><strong>Password:</strong> <!-- -->${password}</p>

          <p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#555">To explore the features and get started, simply visit your account by clicking the button below:</p>

<!-- Action Button -->
          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="text-align:center;margin-bottom:40px">
            <tbody>
              <tr>
                <td><a href="https://rentprompts.com" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:15px 30px 15px 30px;background-color:#2563eb;border-radius:5px;color:#fff;font-size:16px;text-align:center;font-weight:bold" target="_blank">
                  <span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:22.5" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span>
                  <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:11.25px">Visit Account</span>
                  <span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span>
                </a></td>
              </tr>
            </tbody>
          </table>

          <!-- Features Section -->
          <p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#555">By verifying your account, you'll unlock access to our <strong>Generative AI Marketplace</strong>, where you can:</p>
          <ul style="padding-left:20px;margin-bottom:20px">
            <li style="font-size:16px;line-height:26px;margin:16px 0;color:#555">Connect with other community members.</li>
            <li style="font-size:16px;line-height:26px;margin:16px 0;color:#555">Explore and share innovative AI prompts.</li>
            <li style="font-size:16px;line-height:26px;margin:16px 0;color:#555">Access exclusive features and resources tailored just for you.</li>
          </ul>

          <p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#555">If you have any questions or need assistance, feel free to reach out to our support team.</p>

          <p style="font-size:16px;line-height:26px;margin:16px 0;margin-bottom:20px;color:#555">Best regards,<br/>The RentPrompts Team</p>

          <hr style="width:100%;border:1px solid #eaeaea;border-top:1px solid #eaeaea;margin:20px 0"/>

          <!-- Footer -->
          <p style="font-size:12px;line-height:24px;margin:16px 0;color:#8898aa;text-align:center;margin-top:40px">If you did not request this email, you can safely ignore it.</p>

        </td>
      </tr>
    </tbody>
  </table>

</body>
</html>
`
}

