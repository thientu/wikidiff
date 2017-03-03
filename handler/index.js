var PubNub = require('pubnub')
var amqp = require('amqplib/callback_api');
var channel;

pubnub = new PubNub({
  //publishKey : 'pub-c-d207fff3-fceb-41a6-83de-bf99dc70ebbe',
  subscribeKey : 'sub-c-b0d14910-0601-11e4-b703-02ee2ddab7fe'
})

pubnub.subscribe({
    channels: ['pubnub-wikipedia'],
})

amqp.connect('amqp://rabbit', function(err, conn) {
  if (err) {
    throw err;
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    ch.assertQueue(q, {durable: true});
    channel = ch;
  });
});

pubnub.addListener({
    message: function(m) {
			console.log(m);
      channel.sendToQueue("hello", new Buffer(JSON.stringify({
        "link": m.message.link
      })), {persistent: true});
      console.log(" [x] Sent 'Hello World!'");
    },
    status: function(s) {
			console.log(s);
    }
})

