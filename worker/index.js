var amqp = require('amqplib/callback_api');
var phantomjs = require('phantomjs');
var AWS = require('aws-sdk');
var credentialFilename = process.env.AWS_CREDENTIAL_FILENAME
var crypto = require('crypto');
if (credentialFilename == "") {
  credentialFilename = "~/.aws/credentials"
}
var credentials = new AWS.SharedIniFileCredentials({filename: credentialFilename});
var s3 = new AWS.S3({
  credentials: credentials
});
var myBucket = 'gianarb.wikidiff.output';
var path = require('path')

process.on('SIGINT', function() {
  process.exit();
});

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
        var key = crypto.createHash('md5').update(data.link).digest("hex");
        s3.putObject({
          Bucket: myBucket,
          Key: key+".png",
          ContentType: "image/png",
          Body: buf
        }, function(err, data) {
          if (err) {
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
