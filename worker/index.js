var amqp = require('amqplib/callback_api');
var phantomjs = require('phantomjs')
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var myBucket = 'gianarb.wikidiff.output';
var path = require('path')

var execFile = require("child_process").execFile

amqp.connect('amqp://rabbit', function(err, conn) {
  if (err) {
    throw err;
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    ch.assertQueue(q, {durable: true});
    ch.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");
    ch.consume(q, function(msg) {
      var content = msg.content.toString();
      console.log("Received %s", content);
      var data = JSON.parse(content);

			execFile(phantomjs.path, [
				path.join(__dirname, './phantomjs-script.js'),
				data.link
			], null, function (err, stdout, stderr) {
        var buf = Buffer.from(stdout, 'base64');
        s3.putObject({
          Bucket: myBucket,
          Key: "non.png",
          ContentType: "image/png",
          Body: buf
        }, function(err, data) {
          if (stdout) {
            console.log("err s3 %s", err)
          } else {
            console.log("Successfully uploaded data to myBucket/myKey");
          }
        });
			})
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, 5 * 1000);
    }, {noAck: false});
  });
});
