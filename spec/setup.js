
var jsdom  = require('jsdom');


// setup jsdom
global.document = jsdom.jsdom([
  '<!doctype html>',
  '<html>',
  '  <head>',
  '    <meta charset="UTF-8"/>',
  '  </head>',
  '  <body></body>',
  '</html>'
].join(""));
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
