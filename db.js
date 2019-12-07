const mongodb = require('mongodb');

const connectionString = 'mongodb+srv://wkylin:Win720101018@cluster0-qsop6.mongodb.net/ComplexApp?retryWrites=true&w=majority';

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongodb.connect(connectionString, connectionOptions, function (err, client) {
  
  // console.log(client.db());
  module.exports = client.db();
  
  const app = require('./app');
  app.listen(3000, () => {
    console.log('Server start at port 3000!');
  });
});
