// utils/emailTemplate.ts
export const htmlTemplate = (url: string, host: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sign in to ${host}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1a73e8;
        padding: 20px;
        color: #ffffff;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 30px;
      }
      .content h1 {
        color: #333333;
        margin-top: 0;
      }
      .content p {
        line-height: 1.6;
        color: #666666;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        background: #1a73e8;
        text-decoration: none;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .footer {
        background-color: #f4f4f7;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }
      .footer a {
        color: #1a73e8;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        Welcome to HackKU!
      </div>
      <div class="content">
        <h1>Sign in to HackKU</h1>
        <p>
          Hello! Thank you for using our platform. To sign in or to create your account, simply click the button below:
        </p>
        <a href="${url}" class="button">Sign in</a>
        <p>
          If you didn't request this, please ignore this email or let us know if you have any concerns.
        </p>
      </div>
      <div class="footer">
        <p>
          Need help? Contact us at
          <a href="mailto:support@hackku.org">support@hackku.org</a>
        </p>
        <p>© ${new Date().getFullYear()} HackKU. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
