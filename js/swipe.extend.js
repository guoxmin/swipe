<!--#include virtual="swipe.js"-->  
/*
*基于swipe2.0进行扩展：
*
*1、nav：[element]导航DOM节点，如果是空元素，则自动生成。
*2、transitionStart：[fn(index,elem)]开始滑动回调函数，对应transitionEnd。
*3、图片按需功能，默认将图片src2属性替换为真实路径。其他按需，可在transitionStart函数中处理。
*
*edit by guoxuemin 2014-03-24
*
*/
function swipe(container, options){
    var noop = function() {};
    var options = options || {},
        index = parseInt(options.startSlide, 10) || 0,
        speed = options.speed||0,
        transitionStart = options.transitionStart || noop,
        callback = options.callback || noop,
        nav = options.nav || null;
    var element = container.children[0],
        slides = element.children;
    if(nav){
        var navs = nav.children;
        if(navs.length>0){
            navs[index].className="current";
        }else{
            var temp = '';
            each(slides,function(i,v){
                temp+="<span class="+(i==index ? "current":"")+">"+(i+1)+"</span>";
            });
            nav.innerHTML = temp;
            navs = nav.children;
        }
        options.callback = function(i,elem){
            navs[index].className = "";
            navs[i].className="current";
            callback(i,elem);
            index = i;
        }
    }
    options.transitionStart = function(to,elem){
        loadImg(elem);
        transitionStart(to,elem);
    }
    var _swipe = new Swipe(container, options);
    navs&&each(navs,function(i,v){
        v.addEventListener("click",function(){
            _swipe.stop();
            _swipe.slide(i,speed);
        },false);
    });
    
    function each(elems,callback){
        for(var i=0,len = elems.length;i<len;i++){
            callback.call(this,i,elems[i]);
        }
    }
    function loadImg(context){
        var imgs = context.querySelectorAll("img[src2]");
        if(!imgs) return;
        each(imgs,function(i,o){
            var src2 = o.getAttribute("src2"),_img = new Image();
            _img.onload = function(){
                o.style.cssText = "filter:alpha(opacity=30);opacity:0.3;";
                o.setAttribute("src", src2);
                o.removeAttribute("src2");
                setTimeout(function(){
                   o.style.cssText = "filter:alpha(opacity=100);opacity:1;-webkit-transition:250ms;-moz-transition:250ms;transition:250ms;";
                }, 5);
            }
            _img.src = src2;
        });
    }
    return _swipe; 
}