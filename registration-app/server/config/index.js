module.exports = {
    auth: {
      secret: process.env.SECRET || 'awdawdawdawd'
    },
    database: {
      local: 'mongodb://localhost/ctn',
    },
    mailer: {
      connectionString: process.env.MAILCONNECTIONSTRING || 'smtp://ctn@musca.uberspace.de:fcbayern1900.!@smtp.musca.uberspace.de:587/?requireTLS=true', 
      defaultFromAddress: 'ctn@musca.uberspace.de'
    }
  };