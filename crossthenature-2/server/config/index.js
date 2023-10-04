module.exports = {
    auth: {
      secret: process.env.SECRET || 'awdawdawdawd'
    },
    database: {
      local: 'mongodb://0.0.0.0:27017/ctn',
    },
    mailer: {
      connectionString: process.env.MAILCONNECTIONSTRING,
      defaultFromAddress: 'info@crossthenature.ch'
    }
  };
