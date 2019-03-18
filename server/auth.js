const auth = require('basic-auth');

module.exports = (request, response, next) => {
  const user = auth(request);
  if (user && user.name === 'admin' && user.pass === '1234') {
    return next();
  }
  response.set('WWW-Authenticate', 'Basic realm="example"');
  return response.status(401).send();
};
