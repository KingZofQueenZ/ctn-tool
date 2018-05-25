module.exports = {
    auth: {
      secret: process.env.SECRET || 'awdawdawdawd'
    },
    database: {
      local: 'mongodb://localhost/ctn',
    },
    mailer: {
      connectionString: process.env.MAILCONNECTIONSTRING, 
      defaultFromAddress: 'info@crossthenature.ch'
    }
  };