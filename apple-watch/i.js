(function(window) {

    function Query(els) {
        this.els = els || [];
        return this;
    }

    Query.prototype.show = function() {
        this.each(function() {
            this.style.display = 'block'
        })
        return this;
    }

    Query.prototype.hide = function() {
        this.each(function() {
            this.style.display = 'none'
        })
        return this;
    }
    
    Query.prototype.each = function(cb) {
        this.els.forEach(function(el, index) {
            cb.apply(el, [el, index])
        })
    }

    window.$ = function(els) {
        return new Query(els)
    };

})(window);