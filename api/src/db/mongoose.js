const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI; // 🔥 ĐÚNG TÊN BIẾN
const dbName = process.env.MONGODB_DB || undefined;

if (!uri) {
  throw new Error("❌ MONGO_URI is not defined in environment variables");
}

let isConnected = false;

async function connectMongo() {
  if (isConnected) return mongoose.connection;

  const conn = await mongoose.connect(uri, {
    dbName,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  return conn.connection;
}

function bindMongoLogs() {
  const conn = mongoose.connection;
  conn.on("connected", () => console.log(`✔ Mongo connected`));
  conn.on("error", (err) => console.error("✖ Mongo error:", err.message));
  conn.on("disconnected", () => console.warn("⚠ Mongo disconnected"));
}

module.exports = { connectMongo, bindMongoLogs };
