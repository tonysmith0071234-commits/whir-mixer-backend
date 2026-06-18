const mongoose = require("mongoose");
const connectDb = require("../config/db");
const Mix = require("../models/Mix");
const { MIX_STATUSES } = require("../config/constants");

const ORDER = ["awaiting_deposit", "confirming", "mixing", "sent"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findQuery(key) {
  return mongoose.isValidObjectId(key) ? { _id: key } : { reference: key.toUpperCase() };
}

(async () => {
  const key = process.argv[2];
  const arg = (process.argv[3] || "next").toLowerCase();

  if (!key) {
    console.error("Usage: npm run advance <reference-or-id> [next|all|<status>]");
    console.error("Statuses:", MIX_STATUSES.join(", "));
    process.exit(1);
  }

  await connectDb();
  const mix = await Mix.findOne(findQuery(key));
  if (!mix) {
    console.error("Mix not found:", key);
    await mongoose.connection.close();
    process.exit(1);
  }

  const setStatus = async (s) => {
    mix.status = s;
    mix.statusHistory.push({ status: s });
    await mix.save();
    console.log("status ->", s);
  };

  if (arg === "all") {
    const start = ORDER.indexOf(mix.status);
    for (let i = start + 1; i < ORDER.length; i++) {
      await setStatus(ORDER[i]);
      if (i < ORDER.length - 1) await sleep(4000);
    }
  } else if (arg === "next") {
    const i = ORDER.indexOf(mix.status);
    if (i >= 0 && i < ORDER.length - 1) await setStatus(ORDER[i + 1]);
    else console.log("already at", mix.status);
  } else if (MIX_STATUSES.includes(arg)) {
    await setStatus(arg);
  } else {
    console.error("Unknown argument:", arg);
  }

  await mongoose.connection.close();
  process.exit(0);
})();
