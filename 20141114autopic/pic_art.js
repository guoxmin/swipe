
function $$(id) {
	return (typeof id == "object") ? id : document.getElementById(id);
}
function touchEvent(elm,fn) {
	if ("ontouchstart" in document.documentElement) {
		elm.addEventListener("touchstart",fn,false);
	}else {
		elm.addEventListener("click",fn,false);
	}
}

function loadJs(url, fn, callbackName) {
	if (url.indexOf("?") != -1) {
		var url = url + '&callback=' + callbackName;
	} else {
		var url = url + '?callback=' + callbackName;
	}
	window[callbackName] = fn;
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", url);
	head.appendChild(script);
	script.onload = script.onreadystatechange = function() {
		var f = script.readyState;
		if (f && f != "loaded" && f != "complete") return;
		script.onload = script.onreadystatechange = null;
		head.removeChild(script);
		delete window[callbackName];
	};
}


var JslideNumCurrent = $$("JslideNumCurrent"),
		JslideNumTotal = $$("JslideNumTotal"),
		JslidePrev = $$("JslidePrev"),
		JslideNext = $$("JslideNext"),
		JslideFirst = $$("JslideFirst"),
		JslideLast = $$("JslideLast");
var pageNo = 1;//第一页
var firstLoad = true;//是否第一次加载



function drawPic() {
	loadJs(picIntf + "&pageSize=30&pageNo=" + pageNo, function(data) {
		JslideNumTotal.innerHTML = data.total;
		var picData = data.rows;
		for (var i = 0; i < picData.length; i++) {
			var aEle = document.createElement("a");
			aEle.className = "m-sliderA-item";
			if (i == 0 && pageNo == 1) {
				aEle.innerHTML = '<img src="' + picData[i].bigPath +'" class="lazy-img">';
			}else {
				aEle.innerHTML = '<img src2="' + picData[i].bigPath +'" src="http://www1.pcbaby.com.cn/wap/img/space4_3.png" class="lazy-img">';
			};
			document.querySelector(".m-sliderA-con").appendChild(aEle);
		}
		pageNo++;

		if (window.Slide) {
			Slide.setup();
		};
		if (firstLoad) {
			firstLoad = false;

			if(window.Slide ) {
				window.Slide.kill();
			}

			


		};
	}, "loadPic");
}

window.Slide = swipe($$("JslideWrap"), {
				continuous: false,
				callback: function(index, elem) {
					elem.parentNode.style.height = (elem.clientHeight||elem.offsetHeight) + "px";
					JslideNumCurrent.innerHTML = parseInt(index) + 1;
					var sizes = window.Slide && Slide.getNumSlides();
					if(sizes && (index==sizes-5) && (sizes < data.total)){
						drawPic();
					}
					if (index == 0) {
						JslideFirst.style.display = "block";
					}else if (index == sizes-1) {
						JslideLast.style.display = "block";
					}else {
						JslideFirst.style.display = "none";
						JslideLast.style.display = "none";
					};
				}
			});



touchEvent($$("JslidePrev"),function () {
	Slide.prev();
});

touchEvent($$("JslideNext"),function () {
	Slide.next();
});