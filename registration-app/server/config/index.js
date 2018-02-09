// Basic configuration object
// Todo: evt. https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html

module.exports = {
    auth: {
      secret: process.env.SECRET
    },
    database: {
      local: 'mongodb://localhost/ctn',

    }
  };