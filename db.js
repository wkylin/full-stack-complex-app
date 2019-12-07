const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('mongodb');

const connectionString = process.env.CONNECTIONSTRING;

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongodb.connect(connectionString, connectionOptions, function (err, client) {
  
  // console.log(client.db());
  // module.exports = client.db();
  module.exports = client;
  
  const app = require('./app');
  app.listen(process.env.PORT, () => {
    console.log('Server start at port 3000!');
  });
});
