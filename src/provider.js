var each   = require('each')
  , extend = require('extend')
  , type   = require('type');


module.exports = Provider;


/**
 * Provider.
 *
 * @param {Object} options - Settings for the current instance of the provider.
 * @param {Function} ready - A callback to call when the provider is ready to
 *                           accept analytics method calls.
 */

function Provider (options, ready) {
  var self = this;
  // Set up a queue of { method : 'identify', args : [] } to call
  // once we are ready.
  this.queue = [];
  this.ready = false;

  // Allow for `options` to only be a string if the provider has specified
  // a default `key`, in which case convert `options` into a dictionary.
  if (type(options) !== 'object') {
    if (type(options) === 'string' && this.key) {
      var key = options;
      options = {};
      options[this.key] = key;
    } else {
      throw new Error('Could not resolve options.');
    }
  }
  // Extend the options passed in with the provider's defaults.
  extend(this.options, options);

  // Wrap our ready function to first read from the queue.
  var dequeue = function () {
    each(self.queue, function (call) {
      var method = call.method
        , args   = call.args;
      self[method].apply(self, args);
    });
    self.ready = true;
    self.queue = [];
    ready();
  };

  // Call the provider's initialize object.
  this.initialize.call(this, this.options, dequeue);
}


/**
 * Helper to add provider methods to the prototype chain, for adding custom
 * providers.
 *
 * Modeled after [Backbone's `extend` method](https://github.com/documentcloud/backbone/blob/master/backbone.js#L1464).
 *
 * @param {Object} properties - Properties to add to the provider's prototype.
 */

Provider.extend = function (properties) {
  var parent = this;
  var child = function () { return parent.apply(this, arguments); };
  var Surrogate = function () { this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();
  extend(child.prototype, properties);
  return child;
};


/**
 * Extend Provider's prototype with some defaults.
 */

extend(Provider.prototype, {

  /**
   * The default options for the provider. This will get `extend`ed on
   * initialize with the current options.
   */

  options : {},


  /**
   * The keyname of the `options` key that is the required key for the provider.
   * This lets us maintain a simple API for the option-less case:
   *
   *     analytics.initialize({
   *       'Provider' : 'REQUIRED_KEYS_VALUE_HERE'
   *     });
   */

  key : undefined,


  /**
   * Initialize the provider, loading any scripts and applying options.
   *
   * @param {Object} options - A dictionary of settings for the provider.
   * @param {Function} ready - A callback to call when the provider is ready to
   *                           accept analytics method calls.
   */

  initialize : function (options, ready) {
    ready();
  },


  /**
   * Adds an item to the provider's internal queue, which will then get replayed
   * when the provider is finally ready.
   *
   * @param {String} method - The analytics method (eg. `track` or `identify`).
   * @param {Object} args - The arguments to call the method with.
   */

  enqueue : function (method, args) {
    this.queue.push({
      method : method,
      args : args
    });
  }
});