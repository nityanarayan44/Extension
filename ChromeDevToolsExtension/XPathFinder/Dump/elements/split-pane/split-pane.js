(function() {
  Polymer('split-pane', {
    // TODO: Remove this unless it is decided to re-write core-splitter.
    /*resizePanels: function (event) {
      var newX = event.offsetX + this.$.left.offsetWidth;
      var totalWidth = this.$.content.offsetWidth;
      this.$.left.style.width = (newX / totalWidth * 100) + '%';
    },*/
    get leftScrollTop() {
      return this.$.left.scrollTop;
    },
    set leftScrollTop(pixels) {
      this.$.left.scrollTop = pixels;
    },
    get rightScrollTop() {
      return this.$.right.scrollTop;
    },
    set rightScrollTop(pixels) {
      this.$.right.scrollTop = pixels;
    }
  });
})();
