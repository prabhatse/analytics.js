// Quantcast
// ---------
// [Documentation](https://www.quantcast.com/learning-center/guides/using-the-quantcast-asynchronous-tag/)

var Provider = require('../provider')
  , extend   = require('extend')
  , load     = require('load-script');


module.exports = Provider.extend({

  key : 'pCode',

  options : {
    pCode : null
  },


  initialize : function (options) {
    window._qevents = window._qevents || [];
    window._qevents.push({ qacct: options.pCode });
    load({
      http  : 'http://edge.quantserve.com/quant.js',
      https : 'https://secure.quantserve.com/quant.js'
    });
  }

});