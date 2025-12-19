const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_dev_key_123', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
