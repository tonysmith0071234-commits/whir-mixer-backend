const mongoose = require("mongoose");
const { mongoUri } = require("./env");

let cached = global.__mongooseConn;
if (!cached) cached = global.__mongooseConn = { conn: null, promise: null };

async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDb;
