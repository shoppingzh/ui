(function(window) {

    function Query(els) {
        if (els instanceof NodeList) {
            this.els = els || [];
        } else {
            this.els = [els]
        }
        return this;
    }

    Query.prototype.show = function() {
        return this.each(function() {
            this.style.display = 'block'
        })
    }

    Query.prototype.hide = function() {
        return this.each(function() {
            this.style.display = 'none'
        })
    }
    
    Query.prototype.each = function(cb) {
        this.els.forEach(function(el, index) {
            cb.apply(el, [el, index])
        })
        return this;
    }

    Query.prototype.addClass = function(classes) {
        if (typeof classes !== 'string' || !classes.trim()) {
            return this;
        }
        var classList = classes.split(' ')
        return this.each(function() {
            var el = this
            classList.forEach(function(cls) {
                if (cls) {
                    el.classList.add(cls)
                }
            })
        })
    }

    Query.prototype.removeClass = function(classes) {
        if (typeof classes !== 'string' || !classes.trim()) {
            return this;
        }
        var classList = classes.split(' ')
        return this.each(function() {
            var el = this
            classList.forEach(function(cls) {
                if (cls) {
                    el.classList.remove(cls)
                }
            })
        })
    }
    
    Query.prototype.toggleClass = function(classes) {
        if (typeof classes !== 'string' || !classes.trim()) {
            return this;
        }
        var classList = classes.split(' ')
        return this.each(function() {
            var el = this
            classList.forEach(function(cls) {
                if (cls) {
                    el.classList.toggle(cls)
                }
            })
        })
    }



    window.$ = function(els) {
        return new Query(els)
    };

})(window);