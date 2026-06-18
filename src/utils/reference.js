const crypto = require("crypto");

function generateReference() {
  const group = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `VLO-${group()}-${group()}-${group()}`;
}

module.exports = { generateReference };
