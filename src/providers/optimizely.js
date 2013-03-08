// Optimizely
// ----------
// [Docs](https://www.optimizely.com/docs/api#overview)

var Provider = require('../provider')
  , each     = require('each')
  , bind     = require('bind');


module.exports = Provider.extend({

  options : {
    // Whether to grab the experiments the visitor has been assigned to on
    // Optimizely and send that data as traits to all the other providers. This
    // makes segmenting by A/B test in your other analytics services possible.
    scrape : false,

    // Whether to send track calls to Optimizely.
    track : true
  },


  initialize : function (options, ready) {
    // Make sure `optimizely` is defined.
    window.optimizely || (window.optimizely = []);

    // We expect the user to have added their Optimizely snippet by hand, at the
    // top of the page, so we're ready immediately.
    ready();

    // If the scrape option is enabled, once all of the providers are ready to
    // receive `identify` calls, scrape our Optimizely data.
    //
    // TODO: this doesn't work yet.
    if (options.scrape) window.analytics.ready(bind(this, this.scrape));
  },


  track : function (event, properties) {
    if (!this.options.track) return;

    // Optimizely tracks `revenue` in cents, instead of as a float.
    // https://www.optimizely.com/docs/api#track-event
    if (properties && properties.revenue) {
      properties.revenue = 100 * properties.revenue;
    }

    window.optimizely.push(['trackEvent', event, properties]);
  },


  // Run through the current Optimizely state variables and scrape out the data
  // about which experiments the user is currently viewing. Then send an
  // `identify` call with a trait for each experiment. This lets you segment by
  // experiment in your other analytics providers.
  scrape : function () {
    var traits = {};

    // For every experiment the user is currently seeing, add a trait with key
    // of the experiment name and value of the variation name.
    var data = window.optimizely.data
      , map  = data.state.variationNamesMap;

    each(map, function (id, variation) {
      var experiment = data.experiments[id].name;
      traits[experiment] = variation;
    });

    // Send out the global `identify` call.
    window.analytics.identify(traits);
  }

});