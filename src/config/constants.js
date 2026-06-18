const SERVICE_FEE_PERCENT = 3;
const NETWORK_FEE_BTC = 0.0005;
const MAX_BTC = 1;
const MIN_CONFIRMATIONS = 1;
const MAX_ADDRESSES = 3;
const ADDRESS_EXPIRY_MINUTES = 15;

const DELAY_OPTIONS = [
  { label: "ASAP", value: "asap", minutes: 0 },
  { label: "1 hour", value: "1h", minutes: 60 },
  { label: "2 hours", value: "2h", minutes: 120 },
  { label: "4 hours", value: "4h", minutes: 240 },
  { label: "8 hours", value: "8h", minutes: 480 },
  { label: "16 hours", value: "16h", minutes: 960 },
  { label: "1 day", value: "1d", minutes: 1440 },
  { label: "2 days", value: "2d", minutes: 2880 },
];

const DELAY_VALUES = DELAY_OPTIONS.map((o) => o.value);

const MIX_STATUSES = ["awaiting_deposit", "confirming", "mixing", "sent", "expired"];

const BTC_ADDRESS_REGEX = /^(bc1[ac-hj-np-z02-9]{11,71}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/;

module.exports = {
  SERVICE_FEE_PERCENT,
  NETWORK_FEE_BTC,
  MAX_BTC,
  MIN_CONFIRMATIONS,
  MAX_ADDRESSES,
  ADDRESS_EXPIRY_MINUTES,
  DELAY_OPTIONS,
  DELAY_VALUES,
  MIX_STATUSES,
  BTC_ADDRESS_REGEX,
};
