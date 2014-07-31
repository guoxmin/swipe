/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
 *edit by guoxuemin 2014-03-24
 *1、初始化，触发callback
 *2、新增开始滑动回调函数：transitionStart
 */

function Swipe(container, options) {

    "use strict";

    // utilities
    var noop = function() {}; // simple no operation function
    var offloadFn = function(fn) {
        setTimeout(fn || noop, 0)
    }; // offload a functions execution

    // check browser capabilities
    var browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function(temp) {
            var props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
            for (var i in props)
                if (temp.style[props[i]] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };

    // quit if no root element
    if (!container) return;

    var element = container.children[0],
        slides=element.children,
        length = slides.length;

    var index = parseInt(options.startSlide, 10) || 0,
        speed = options.speed || 300,
        isContinuous = options.continuous,
        vertical = options.vertical || false;

    if(isContinuous){
        var html = element.innerHTML;
        if(length==2){
            element.innerHTML = html + html ;
        }else if(length== 1){
            element.innerHTML = html + html + html;
        }
    }
        
    var lIndex = index-1,
        rIndex = index+1,
        isTransitionStart,slidePos,client,width,height;

    var size = vertical ? "height":"width",
        offset = vertical ? "top":"left",
        xy = vertical ? "y":"x";

    function setup() {
        
        // create an array to store current positions of each slide
        slidePos = new Array(slides.length);
        container.style.overflow = "hidden";
        // determine width or height of each slide
        client = container.getBoundingClientRect()[size] || (vertical ? container.offsetHeight:container.offsetWidth);
        element.style[size] = (slides.length * client) + 'px';
        var pos = slides.length;
        while (pos--) {
            var slide = slides[pos];
            slide.style[size] = client + 'px';
            slide.style.display = "inline";
            slide.style.cssFloat = "left";
            slide.style.position = "relative";
            slide.style[offset] = (pos * -client) + 'px';
            

            if(length>2){
                slide.setAttribute('data-index', pos);
            }else if(length==2){
                slide.setAttribute('data-index', pos%2);
            }else if(length== 1){
                slide.setAttribute('data-index', 0);
            }

            if (browser.transitions) {
                var dist = index > pos  ? -client : (index < pos) ? client : 0;
                if (isContinuous) {
                    if(index == slides.length - 1 && pos == 0){
                        dist = client;
                        rIndex = 0;
                    }
                    if(!index && pos == slides.length - 1){
                        dist = -client;
                        lIndex = pos;
                    }
                }

                 //当前项目不滑动，解决页面加载时的空白问题
                if(pos!=index){
                   move(pos, dist, 0); 
                }else{
                     slidePos[index] = 0;
                }
                

            }

        }


        if (!browser.transitions) element.style[offset] = (index * -client) + 'px';
        var callbackIndex = slides[index].getAttribute('data-index');
        offloadFn(options.transitionStart && options.transitionStart(callbackIndex, slides[callbackIndex])); //add by guoxuemin
        container.style.visibility = 'visible';

    }
    function initPos(){
        // stack elements
        var pos = slides.length;
        while (pos--) {
            if (browser.transitions) {
                var dist = index > pos  ? -client : (index < pos) ? client : 0;
                if (isContinuous) {
                    if(index == slides.length - 1 && pos == 0){
                        dist = client;
                        rIndex = 0;
                    }
                    if(!index && pos == slides.length - 1){
                        dist = -client;
                        lIndex = pos;
                    }
                }
               
               move(pos, dist, 0);
               
                
            }

        }
    }

    function prev() {
        if (index)  slide(lIndex,speed,-1);
        else if (isContinuous)  slide(lIndex,speed,-1);

    }

    function next() {
       
        if (index < slides.length - 1)  slide(rIndex,speed,1);
        else if (isContinuous)  slide(rIndex,speed,1);
    
    }

    function slide(to, slideSpeed,direction) {
        if (index == to || to <0 || to>slides.length-1) return;
        //避免多次执行
        
       if(!isTransitionStart){
            var callbackIndex = slides[to].getAttribute('data-index');
            offloadFn(options.transitionStart && options.transitionStart(callbackIndex, slides[callbackIndex]));
       }

        // do nothing if already on requested slide
        

        if (browser.transitions) {
        if(!direction) direction = -Math.abs(index-to) / (index-to);
        if (direction>0) {
               // next()
                move(lIndex, -client, 0);
                move(index, slidePos[index] - client, speed);
                move( rIndex, slidePos[rIndex] - client, speed);
                index = rIndex;
            } else {

              // prev
                move(rIndex, +client, 0);
                move(index, slidePos[index] + client, speed);
                move(lIndex, slidePos[lIndex] + client, speed);
                index = lIndex;

            }

        } else {

            animate(index * -client, to * -client, slideSpeed || speed);

        }

        lIndex = to-1;
        index = to;
        rIndex = to+1;
        
        var callbackIndex = slides[index].getAttribute('data-index');
        offloadFn(options.callback && options.callback(callbackIndex, slides[callbackIndex]));

    }

    function move(index, dist, speed) {
        translate(index, dist, speed);
        slidePos[index] = dist;

    }

    function translate(index, dist, speed) {

        var slide = slides[index];
        var style = slide && slide.style;

        if (!style) return;
        var distX = vertical ? 0:dist,
            distY = vertical ? dist:0;
        style.webkitTransitionDuration =
            style.MozTransitionDuration =
            style.msTransitionDuration =
            style.OTransitionDuration =
            style.transitionDuration = speed + 'ms';

        style.webkitTransform = 'translate(' + distX + 'px,'+distY+'px)' + 'translateZ(0)';
        style.msTransform =
            style.MozTransform =
            style.OTransform = vertical ? 'translateY(' + dist + 'px)':'translateX(' + dist + 'px)';


    }

    function animate(from, to, speed) {

        // if not an animation, just reposition
        if (!speed) {

            element.style[offset] = to + 'px';
            return;

        }

        var start = +new Date;

        var timer = setInterval(function() {

            var timeElap = +new Date - start;

            if (timeElap > speed) {

                element.style[offset] = to + 'px';

                if (delay) begin();

                options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                clearInterval(timer);
                return;

            }

            element.style[offset] = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';

        }, 4);

    }

    // setup auto slideshow
    var delay = options.auto || 0;
    var interval;

    function begin() {
        interval = setTimeout(next, delay);

    }

    function stop() {
        //edit by guoxuemin
        //delay = 0;
        clearTimeout(interval);

    }


    // setup initial vars
    var start = {};
    var delta = {};
    var isScrolling;

    // setup event capturing
    var events = {

        handleEvent: function(event) {
            switch (event.type) {
                case 'touchstart':
                    this.start(event);
                    break;
                case 'touchmove':
                    this.move(event);
                    break;
                case 'touchend':
                    offloadFn(this.end(event));
                    break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend':
                    offloadFn(this.transitionEnd(event));
                    break;
                case 'resize':
                    offloadFn(setup.call());
                    break;
            }

            if (options.stopPropagation) event.stopPropagation();

        },
        start: function(event) {
            initPos();
            var touches = event.touches[0];

            // measure start values
            start = {

                // get initial touch coords
                x: touches.pageX,
                y: touches.pageY,

                // store time to determine touch duration
                time: +new Date

            };

            // used for testing first move event
            isScrolling = undefined;

            // reset delta and end measurements
            delta = {};
            isTransitionStart = false;
            // attach touchmove and touchend listeners
            element.addEventListener('touchmove', this, false);
            element.addEventListener('touchend', this, false);

        },
        move: function(event) {

            // ensure swiping with one touch and not pinching
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return

            if (options.disableScroll) event.preventDefault();

            var touches = event.touches[0];

            // measure change in x and y
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            }

            // determine if scrolling test has run - one time test
           
            if (typeof isScrolling == 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(delta[vertical ? 'y':'x']) < Math.abs(delta[vertical ? 'x':'y']));
            }
            // if user is not trying to scroll vertically
            if (!isScrolling) {

                // prevent native scrolling 
                event.preventDefault();

                // stop slideshow
                stop();

                // increase resistance if first or last slide
                if(!isContinuous){
                    delta[xy] =
                    delta[xy] /
                    ((!index && delta[xy] > 0 // if first slide and sliding left
                        || index == slides.length - 1 // or if last slide and sliding right
                        && delta[xy] < 0 // and if sliding at all
                    ) ?
                    (Math.abs(delta[xy]) / client + 1) // determine resistance level
                    : 1); // no resistance if false
                }

                

                // translate 1:1

                translate(lIndex, delta[xy] + slidePos[lIndex], 0);
                translate(index, delta[xy] + slidePos[index], 0);
                translate(rIndex, delta[xy] + slidePos[rIndex], 0);
                var _index = delta[xy] > 0 ? lIndex:rIndex ;

                if(!isTransitionStart && slides[_index]){

                    var callbackIndex = slides[_index].getAttribute('data-index');
                    offloadFn( options.transitionStart && options.transitionStart(callbackIndex, slides[callbackIndex])); //
                }
                isTransitionStart = true;
            }
        },
        end: function(event) {

            // measure duration
            var duration = +new Date - start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250 // if slide duration is less than 250ms
                && Math.abs(delta[xy]) > 20 // and if slide amt is greater than 20px
                || Math.abs(delta[xy]) > client / 2; // or if slide amt is greater than half the client

            // determine if slide attempt is past start and end
            var isPastBounds =  isContinuous ? false:(!index && delta[xy] > 0 // if first slide and slide amt is greater than 0
                || index == slides.length - 1 && delta[xy] < 0); // or if last slide and slide amt is less than 0

            // determine direction of swipe (true:right, false:left)
            var direction = delta[xy] < 0;

            // if not scrolling vertically
            if (!isScrolling) {

                if (isValidSlide && !isPastBounds) {
                    if (direction) {
                        //next
                        next()
                        // move(lIndex, -client, 0);
                        // move(index, slidePos[index] - client, speed);
                        // move( rIndex, slidePos[rIndex] - client, speed);
                        // index = rIndex;
                    } else {
                      // prev
                      prev();
                        // move(rIndex, +client, 0);
                        // move(index, slidePos[index] + client, speed);
                        // move(lIndex, slidePos[lIndex] + client, speed);
                        // index = lIndex;

                    }

                } else {

                    move(lIndex, -client, speed);
                    move(index, 0, speed);
                    move(rIndex, client, speed);

                }

            }

            // kill touchmove and touchend event listeners until touchstart called again
            element.removeEventListener('touchmove', events, false)
            element.removeEventListener('touchend', events, false)

        },
        transitionEnd: function(event) {
            initPos();

           //确保执行一次
           var dataIndex = parseInt(event.target.getAttribute('data-index'), 10);
            if (dataIndex == index) {
                if (delay) begin();
                options.transitionEnd && options.transitionEnd.call(event, dataIndex, slides[dataIndex]);

            }

        }

    }

    // trigger setup
    setup();

    // start auto slideshow if applicable
    if (delay) begin();


    // add event listeners
    if (browser.addEventListener) {

        // set touchstart event on element    
        if (browser.touch) element.addEventListener('touchstart', events, false);

        if (browser.transitions) {
            element.addEventListener('webkitTransitionEnd', events, false);
            element.addEventListener('msTransitionEnd', events, false);
            element.addEventListener('oTransitionEnd', events, false);
            element.addEventListener('otransitionend', events, false);
            element.addEventListener('transitionend', events, false);
        }

        // set resize event on window
        window.addEventListener('resize', events, false);

    } else {

        window.onresize = function() {
            setup()
        }; // to play nice with old IE

    }

    // expose the Swipe API
    return {
        setup: function() {

            setup();

        },
        slide: function(to, speed) {

            slide(to, speed);

        },
        prev: function() {

            // cancel slideshow
            stop();

            prev();

        },
        next: function() {
            stop();

            next();

        },
        getPos: function() {

            // return current index position
            return index;

        },
        stop: function() {
            stop();
        },
        start: function() {
            begin();
        },
        kill: function() {

            // cancel slideshow
            stop();

            // reset element
            element.style[size] = 'auto';
            element.style[offset] = 0;

            // reset slides
            var pos = slides.length;
            while (pos--) {

                var slide = slides[pos];
                slide.style[size] = '100%';
                slide.style[offset] = 0;

                if (browser.transitions) translate(pos, 0, 0);

            }

            // removed event listeners
            if (browser.addEventListener) {

                // remove current event listeners
                element.removeEventListener('touchstart', events, false);
                element.removeEventListener('webkitTransitionEnd', events, false);
                element.removeEventListener('msTransitionEnd', events, false);
                element.removeEventListener('oTransitionEnd', events, false);
                element.removeEventListener('otransitionend', events, false);
                element.removeEventListener('transitionend', events, false);
                window.removeEventListener('resize', events, false);

            } else {

                window.onresize = null;

            }

        }
    }

}

if (window.jQuery || window.Zepto) {
    (function($) {
        $.fn.Swipe = function(params) {
            return this.each(function() {
                $(this).data('Swipe', new Swipe($(this)[0], params));
            });
        }
    })(window.jQuery || window.Zepto)
}