const redis = require("redis");
/* connecting to redis db */
const client = redis.createClient();
client.connect();
client.on("connect", function () {
  console.log("connected to redis db!");
});

client.set("framework", "ReactJS");

client.exists("framework", function (err, reply) {
  if (reply === 1) console.log("exists!");
  else console.log("doesnt exist");
});

module.exports = client;
