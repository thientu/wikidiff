var amqp = require('amqplib/callback_api');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var myBucket = 'gianarb.wikidiff.output';
var phantom = require('phantom');

amqp.connect('amqp://rabbit', function(err, conn) {
  if (err) {
    throw err;
  }
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");
    ch.consume(q, function(msg) {
      var content = msg.content.toString();
      console.log("Received %s", content);
      var data = JSON.parse(content);
      phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
          console.log("Working on %s", data.link);
          page.open(data.link, function(status) {
              console.log("Status: " + status);
              if(status === "success") {
                //page.render('example.png');
                var buffer = page.renderBuffer("png", -1);
                s3.putObject({Bucket: myBucket, Key: "/non.png", Body: buffer}, function(err, data) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log("Successfully uploaded data to myBucket/myKey");
                  }
                });
              }
              phantom.exit();
          });
        });
      });

    }, {noAck: true});
  });
});
