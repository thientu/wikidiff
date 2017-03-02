var page = require('webpage').create();
var url = 'http://phantomjs.org/';
page.open(url, function (status) {
  if(status === "success") {
    page.render('example.png');
  }
  echo "alaalal";
  phantom.exit();
  exit 0
});
