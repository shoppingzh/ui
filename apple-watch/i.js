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
        var opts = Object.assign({}, WatchDial.defauls, options);
        this.options = opts;
        var number = opts.number || 0;
        
        var html = '';
        for(var i = 0; i <= number - 1; i++) {
            var classList = ['point-line'], styleList = [];
            var isBreak =  isBreakAt(i);
            if (isBreak) {
                // classList.push('point-line--break');
            }

            // 背景色
            if (isBreak && opts.break.color) {
                styleList.push('background-color: ' + opts.break.color);
            } else {
                styleList.push('background-color: ' + opts.color);
            }

            // 大小
            if (isBreak && opts.break.width) {
                styleList.push('width: ' + opts.break.width + 'px');
                styleList.push('margin-left: -' + (opts.break.width / 2) + 'px');
            } else if (opts.width) {
                styleList.push('width: ' + opts.width + 'px');
                styleList.push('margin-left: -' + (opts.width / 2) + 'px');
            }
            if (isBreak && opts.break.height) {
                styleList.push('height: ' + opts.break.height + 'px');
                styleList.push('margin-top: -' + (opts.break.height / 2) + 'px');
            } else if (opts.height) {
                styleList.push('height: ' + opts.height + 'px');
                styleList.push('margin-top: -' + (opts.height / 2) + 'px');
            }

            html += '<div ';
            html += 'class="'+ classList.join(' ') +'"';
            if (styleList.length) {
                html += 'style="'+ styleList.join('; ') +'"';
            }
            html += '></div>';
        }
        el.innerHTML = html;

        var lines = el.querySelectorAll('.point-line');
        // 确定位置
        var R = el.clientWidth / 2;
        // 指针距离表盘外圈的偏移量
        var offset = opts.offset > 0 && opts.offset < R ? opts.offset : 0;
        lines.forEach(function(line, index) {
            var isBreak = isBreakAt(index);
            var r = (isBreak && opts.break.width > 0) ? opts.break.width : opts.width;
            r += offset;
            var degree = index * (360 / opts.number);
            var pos = $.getRotatePosition(R - r / 2, degree);
            line.style.transform = `rotate(${degree}deg)`;
            line.style.left = (pos.x + R) + 'px';
            line.style.top = (pos.y + R) + 'px';
        })        

        function isBreakAt(index) {
            if (!opts.break) {
                return false;
            }
            var at = opts.break.at;
            if (typeof at === 'number') {
                return index % at === 0;
            } else if (Array.isArray(at)) {
                return at.indexOf(index) >= 0;
            }
            return false;
        }
    }

    WatchDial.defauls = {
        offset: 0,
        color: '#fff',
        number: 60,
        width: 6,
        height: 1,
        break: {
            at: 5,
            color: null,
            width: 12,
            height: null
        }
    }

    window.WatchDial = WatchDial;

})()

/**
 * 钟表指针
 */
;(function(window, document) {

    function Tick(options) {
        this.options = Object.assign({}, options, Tick.defauls);
        this.init();
    }

    Tick.prototype = {
        init: function() {
            this.start();
        },
        start: function() {
            this.running = true;
            this._doTick(this.options.callback);
        },
        stop: function() {
            this.running = false;
            clearTimeout(this.timer);
        },
        _doTick: function(callback) {
            var that = this;
            clearTimeout(that.timer);
            that.timer = setTimeout(function() {
                if (callback) {
                    callback.call(that);
                }
                if (that.running) {
                    that._doTick(callback);
                }
            }, that.options.with)
        }
    }

    Tick.defauls = {
        with: 1000
    }

    function Clock(el, options) {
        this.el = el;
        this.options = options;
        this.init();
    }

    Clock.prototype = {
        init: function() {
            this.hp = document.createElement('div');
            this.mp = document.createElement('div');
            this.sp = document.createElement('div');
            this.hp.classList.add('hour-pointer');
            this.mp.classList.add('minute-pointer');
            this.sp.classList.add('second-pointer');

            this.el.appendChild(this.hp);
            this.el.appendChild(this.mp);
            this.el.appendChild(this.sp);

            var that = this;

            that._render();
            this.tick = new Tick({
                with: 1000,
                callback: function() {
                    that._render();
                }
            })

        },
        start: function() {
            this.tick.start();
        },
        stop: function() {
            this.tick.stop();
        },
        _render: function() {
            var now = new Date()
            var h = now.getHours()
            var m = now.getMinutes()
            var s = now.getSeconds()
            this.hp.style.transform = `rotate(${(h % 12) / 12 * 360 - 90}deg)`
            this.mp.style.transform = `rotate(${m / 60 * 360 - 90}deg)`
            this.sp.style.transform = `rotate(${s * 6 - 90}deg)`
        }
    }

    window.Tick = Tick;
    window.Clock = Clock;

})(window, document)