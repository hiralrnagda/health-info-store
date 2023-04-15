//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key

//We have 4 types of exchange - DIRECT, FANOUT, TOPIC, HEADER - we are using direct
const rabbit = require("amqplib");
const QUEUE_NAME = "info7255";
const EXCHANGE_TYPE = "direct";
const EXCHANGE_NAME = "main";
const KEY = "my-index";
let channel;
connection = rabbit.connect("amqp://localhost");
connection.then(async (conn) => {
  channel = await conn.createChannel();
  await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE); //create an exchange
  await channel.assertQueue(QUEUE_NAME); //create a queue
  channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, KEY); //bind "info7255" with routingKey
});

module.exports = async function publishMessage(routingKey, obj, message) {
  const logDetails = {
    logType: routingKey,
    message: message,
    obj: obj,
    dateTime: new Date(),
  };
  await channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(logDetails))
  );
};
