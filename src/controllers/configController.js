const c = require("../config/constants");

exports.getConfig = (req, res) => {
  res.json({
    serviceFeePercent: c.SERVICE_FEE_PERCENT,
    networkFeeBtc: c.NETWORK_FEE_BTC,
    maxBtc: c.MAX_BTC,
    minConfirmations: c.MIN_CONFIRMATIONS,
    maxAddresses: c.MAX_ADDRESSES,
    addressExpiryMinutes: c.ADDRESS_EXPIRY_MINUTES,
    delayOptions: c.DELAY_OPTIONS,
  });
};
