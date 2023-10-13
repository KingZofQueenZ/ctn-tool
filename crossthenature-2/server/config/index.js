module.exports = {
  auth: {
    secret: process.env.SECRET || "dev-secret",
  },
  database: {
    local: "mongodb://0.0.0.0:27017/ctn",
  },
  mailer: {
    connectionString:
      process.env.MAILCONNECTIONSTRING ||
      "smtp://ctn:replace-me@iapetus.uberspace.de:587/?requireTLS=true",
    defaultFromAddress: "info@crossthenature.ch",
  },
  captcha: {
    secretKey: process.env.CAPTCHAKEY || "dev-key",
  },
};
