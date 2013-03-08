describe('Optimizely', function () {

  describe('initialize', function () {

    this.timeout(10000);

    it('should call ready and load library', function (done) {
      expect(window.optimizely).not.to.be(undefined);

      var spy = sinon.spy();
      analytics.ready(spy);
      analytics.initialize({ 'Optimizely' : test['Optimizely'] });
      expect(spy.called).to.be(true);

      // When the library loads, it creats a `optimizelyCode` method.
      var interval = setInterval(function () {
        if (!window.optimizelyCode) return;
        expect(window.optimizelyCode).not.to.be(undefined);
        expect(window.optimizelyPreview).not.to.be(undefined);
        clearInterval(interval);
        done();
      }, 20);
    });

  });


  describe('track', function () {

    it('should call "trackEvent" when track is true');

    it('shouldnt call "trackEvent" when track is false');

  });


  describe('scrape', function () {

    it('shouldnt call global identify when scrape is false');

    it('should call global identify when scrape is true');

  });

});