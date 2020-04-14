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

    Query.prototype.text = function(text) {
        return this.each(function() {
            this.innerText = text
        })
    }


    window.$ = function(els) {
        return new Query(els)
    };

    $.getRotatePosition = function(r, deg) {
        var radian = 2 * Math.PI / 360;
        return {
            x: r * Math.cos(radian * deg),
            y: r * Math.sin(radian * deg)
        }
    }

})(window);

/**
 * 表盘
 */
;(function() {

    function WatchDial(el, options) {
        if (typeof el === 'string') {
            el = document.querySelector(el);
        }
        if (el == null) {
            throw new Error('表盘元素不存在');
        }
        this.el = el;
        var opts = Object.assign({}, WatchDial.defauls, options)

        var html = '';
        for(var i = 0; i < 60; i++) {
            html += '<div '
            html += 'class="point-line '
            if (i % 5 === 0) {
                html += 'point-line--break ';
            }
            html += '"> ';
            html += '</div>';
        }
        el.innerHTML = html;

        var lines = el.querySelectorAll('.point-line')
        var R = el.clientWidth / 2
        var r = lines[0].clientWidth / 2

        if (opts.offset > 0 && opts.offset < R) {
            r += opts.offset
        }

        lines.forEach(function(line, index) {
            var isBreak = (index % 5) === 0
            var degree = index * 6
            var pos = $.getRotatePosition(R - r, degree)
            line.style.transform = `rotate(${degree}deg)`
            line.style.left = (pos.x + R) + 'px'
            line.style.top = (pos.y + R) + 'px'
            if (opts.color) {
                line.style.backgroundColor = opts.color
            }
            if (isBreak && (opts.breakColor || opts.color)) {
                line.style.backgroundColor = opts.breakColor || opts.color
            }

        })
    }

    WatchDial.defauls = {
        offset: 3,
        color: '#fff',
        breakColor: null
    }

    window.WatchDial = WatchDial;

})()