(function() {
  var EXPAND_BTN_IMAGE = '../res/expand.png';
  var COLLAPSE_BTN_IMAGE = '../res/collapse.png';
  var BLANK_IMAGE = '../res/blank.png';

  function copyArray(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      newArr.push(arr[i]);
    }
    return newArr;
  }
  /**
   * Converts a value represented as a string to an actual JS object.
   * E.g. : "true" -> true and "5" -> 5
   */
  function smartCast(val) {
    if ((val.length >= 2 &&
      (val[0] === '"' && val[val.length - 1] === '"') ||
      (val[0] === '\'' && val[val.length - 1] === '\''))) {
      return val.substring(1, val.length - 1);
    }
    switch (val) {
      case 'true':
        return true;
      case 'false':
        return false;
      case 'null':
        return null;
      case 'undefined':
        return undefined;
    }
    if (!isNaN(parseInt(val, 10))) {
      return parseInt(val, 10);
    }
    throw 'Bad value';
  }
  /**
   * Check if a value is valid
   */
  function isFieldValueValid(val) {
    try {
      smartCast(val);
    } catch (e) {
      return false;
    }
    return true;
  }
  Polymer('object-tree', {
    baseWidth: 14,
    ready: function() {
      this.tree = [];
      this.path = [];
      // When one of the fields change, it will let the object-tree know
      // with this event
      this.addEventListener('field-changed', function(event) {
        var newValue = event.detail.newValue;
        var oldValue = event.detail.oldValue;
        var index = event.detail.field.id.substring(5);
        var path = copyArray(this.path);
        path.push(index);
        // Reset it to the old value since O.o() will update it anyway after reflection
        event.detail.field.text = oldValue;
        // Stop propagation since this will fire another event
        event.stopPropagation();
        if (!isFieldValueValid(newValue)) {
          return;
        }
        var that = this;
        // Fire an event with all the information
        this.fire('property-changed', {
          path: path,
          value: smartCast(newValue),
          // reEval is needed if it is an accessor and O.o() won't update it.
          reEval: event.detail.field.getAttribute('data-hasAccessor') === 'true',
          tree: that.tree,
          name: event.detail.name
        });
      });
      // When the `tree` property is updated, Polymer might add
      // some object-trees under this. Those child trees need to be initialized.
      this.addEventListener('child-added', function(event) {
        var child = event.detail.child;
        if (child === this) {
          return;
        }
        var index = event.detail.index;
        if (this.tree[index].value instanceof Array) {
          child.tree = this.tree[index].value;
          var pathCopy = copyArray(this.path);
          pathCopy.push(index);
          child.path = pathCopy;
        }
        event.stopPropagation();
      });
      // When this message is heard, it destroys a child of itself.
      this.addEventListener('child-collapsed', function(event) {
        var index = event.detail.index;
        // Empty the child tree.
        this.tree[index].value.length = 0;
        event.stopPropagation();
      });
    },
    /**
     * Called when Polymer instantiates this object tree because of
     * data-binding (with template repeat)
     */
    domReady: function() {
      var that = this;
      this.fire('child-added', {
        child: that,
        index: that.id.substring(5)
      });
    },
    /**
     * Collapse/Uncollapse
     */
    toggle: function(event) {
      var targetId = event.target.id;
      var state = event.target.getAttribute('state');
      if (state === 'expanded') {
        this.fire('child-collapsed', {
          index: targetId.substring(3)
        });
      }
      var path = copyArray(this.path);
      path.push(targetId.substring(3));
      var eventName = (state === 'collapsed') ? 'object-expand' : 'object-collapse';
      this.fire(eventName, {
        path: path
      });
    },
    /**
     * Called when the refresh button is clicked on an accessor
     */
    refreshField: function(event) {
      var targetIndex = event.target.id.substring(7);
      var path = copyArray(this.path);
      path.push(targetIndex);
      var that = this;
      this.fire('refresh-property', {
        path: path,
        index: targetIndex,
        tree: that.tree,
        name: event.target.getAttribute('data-name')
      });
    }
  });
})();
