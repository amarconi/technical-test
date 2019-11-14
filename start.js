const app = require('./app');

let port = 3002;

const server = app.listen(port, () => {
  console.log('Express is running on port ' + port);
});