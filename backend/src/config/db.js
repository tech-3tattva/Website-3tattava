const dns = require("dns");
const mongoose = require("mongoose");

function assertEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

async function connectDb() {
  assertEnv("MONGODB_URI");

  // Some office/coworking networks block Atlas SRV lookups via their default DNS.
  // Force Node to use public resolvers so mongodb+srv URIs can resolve reliably.
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  mongoose.set("strictQuery", false);

  // Reconnect strategy helps local dev stability
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: undefined,
  });

  // Guest carts used to store user:null with a unique index → only one guest cart (E11000).
  const Cart = require("../models/Cart");
  try {
    await Cart.collection.dropIndex("user_1");
  } catch {
    /* index missing or already replaced */
  }
  await Cart.syncIndexes();
  await Cart.collection.updateMany({ user: null }, { $unset: { user: "" } });

  // eslint-disable-next-line no-console
  console.log("[backend] connected to MongoDB");
}

module.exports = { connectDb };

