var https = require('https');
var amqp = require('amqplib/callback_api');
var channel;

process.on('SIGINT', function() {
  process.exit();
});

var io = require( 'socket.io-client' );
var socket = io.connect( 'https://stream.wikimedia.org/rc' );

socket.on('connect', function () {
     socket.emit( 'subscribe', '*.wikidata.org' );
});

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

socket.on('change', function ( data ) {
	if (data.type == "edit") {
		link = data.server_url+data.server_script_path+"/index.php?diff="+data.revision['new']+"&oldid="+data.revision.old,
		channel.sendToQueue("hello", new Buffer(JSON.stringify({
			"link": link
		})), {persistent: true});
	}
});
