const axios = require('axios');

async function testMe() {
  try {
    // 1. Get first user from DB
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/eqhire');
    
    // We can just use the controller directly or via axios
    // Actually better to just do it via HTTP if we know a user email.
    console.log("Connect complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testMe();
