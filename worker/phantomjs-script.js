var page = require('webpage').create();

var system = require('system');
var args = system.args;
page.open(args[1], function(status) {
  if(status === "success") {
    var base = page.renderBase64("PNG");
    console.log(base);
  }
  phantom.exit();
});
