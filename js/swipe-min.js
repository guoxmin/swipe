function Swipe(B,u){var K=function(){};var k=function(L){setTimeout(L||K,0);};var i={addEventListener:!!window.addEventListener,touch:("ontouchstart" in window)||window.DocumentTouch&&document instanceof DocumentTouch,transitions:(function(L){var N=["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"];for(var M in N){if(L.style[N[M]]!==undefined){return true;}}return false;})(document.createElement("swipe"))};if(!B){return;}var r=B.children[0],l=r.children;var z=parseInt(u.startSlide,10)||0,F=u.speed||300,E=u.continuous,J=u.vertial||false;var j=z-1,p=z+1,c,H,G,a,e;var m=J?"height":"width",D=J?"top":"left",x=J?"y":"x";function n(){H=new Array(l.length);B.style.overflow="hidden";G=B.getBoundingClientRect()[m]||(J?B.offsetHeight:B.offsetWidth);r.style[m]=(l.length*G)+"px";var M=l.length;while(M--){var L=l[M];L.style[m]=G+"px";L.style.display="inline";L.style.cssFloat="left";L.style.position="relative";L.setAttribute("data-index",M);L.style[D]=(M*-G)+"px";}o();if(!i.transitions){r.style[D]=(z*-G)+"px";}k(u.transitionStart&&u.transitionStart(z,l[z]));B.style.visibility="visible";}function o(){var M=l.length;while(M--){if(i.transitions){var L=z>M?-G:(z<M)?G:0;if(E){if(z==l.length-1&&M==0){L=G;p=0;}if(!z&&M==l.length-1){L=-G;j=M;}}s(M,L,0);}}}function y(){if(z){b(j,F,-1);}else{if(E){b(j,F,-1);}}}function h(){if(z<l.length-1){b(p,F,1);}else{if(E){b(p,F,1);}}}function b(N,L,M){if(z==N||N<0||N>l.length-1){return;}!c&&k(u.transitionStart&&u.transitionStart(N,l[N]));if(i.transitions){if(!M){M=-Math.abs(z-N)/(z-N);}if(M>0){s(j,-G,0);s(z,H[z]-G,F);s(p,H[p]-G,F);z=p;}else{s(p,+G,0);s(z,H[z]+G,F);s(j,H[j]+G,F);z=j;}}else{I(z*-G,N*-G,L||F);}j=N-1;z=N;p=N+1;k(u.callback&&u.callback(z,l[z]));}function s(L,N,M){g(L,N,M);H[L]=N;}function g(O,R,Q){var M=l[O];var P=M&&M.style;if(!P){return;}var N=J?0:R,L=J?R:0;P.webkitTransitionDuration=P.MozTransitionDuration=P.msTransitionDuration=P.OTransitionDuration=P.transitionDuration=Q+"ms";P.webkitTransform="translate("+N+"px,"+L+"px)translateZ(0)";P.msTransform=P.MozTransform=P.OTransform=J?"translateY("+R+"px)":"translateX("+R+"px)";}function I(P,O,L){if(!L){r.style[D]=O+"px";return;}var N=+new Date;var M=setInterval(function(){var Q=+new Date-N;if(Q>L){r.style[D]=O+"px";if(A){q();}u.transitionEnd&&u.transitionEnd.call(event,z,l[z]);clearInterval(M);return;}r.style[D]=(((O-P)*(Math.floor((Q/L)*100)/100))+P)+"px";},4);}var A=u.auto||0;var f;function q(){f=setTimeout(h,A);}function t(){clearTimeout(f);}var w={};var C={};var d;var v={handleEvent:function(L){switch(L.type){case"touchstart":this.start(L);break;case"touchmove":this.move(L);break;case"touchend":k(this.end(L));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":k(this.transitionEnd(L));break;case"resize":k(n.call());break;}if(u.stopPropagation){L.stopPropagation();}},start:function(L){o();var M=L.touches[0];w={x:M.pageX,y:M.pageY,time:+new Date};d=undefined;C={};c=false;r.addEventListener("touchmove",this,false);r.addEventListener("touchend",this,false);},move:function(L){if(L.touches.length>1||L.scale&&L.scale!==1){return;}if(u.disableScroll){L.preventDefault();}var M=L.touches[0];C={x:M.pageX-w.x,y:M.pageY-w.y};if(typeof d=="undefined"){d=!!(d||Math.abs(C[J?"y":"x"])<Math.abs(C[J?"x":"y"]));}if(!d){L.preventDefault();t();if(!E){C[x]=C[x]/((!z&&C[x]>0||z==l.length-1&&C[x]<0)?(Math.abs(C[x])/G+1):1);}g(j,C[x]+H[j],0);g(z,C[x]+H[z],0);g(p,C[x]+H[p],0);var N=C[x]>0?z-1:z+1;!c&&k(l[N]&&u.transitionStart&&u.transitionStart(N,l[N]));c=true;}},end:function(N){var P=+new Date-w.time;var M=Number(P)<250&&Math.abs(C[x])>20||Math.abs(C[x])>G/2;var L=E?false:(!z&&C[x]>0||z==l.length-1&&C[x]<0);var O=C[x]<0;if(!d){if(M&&!L){if(O){h();}else{y();}}else{s(z-1,-G,F);s(z,0,F);s(z+1,G,F);}}r.removeEventListener("touchmove",v,false);r.removeEventListener("touchend",v,false);},transitionEnd:function(L){o();if(parseInt(L.target.getAttribute("data-index"),10)==z){if(A){q();}u.transitionEnd&&u.transitionEnd.call(L,z,l[z]);}}};n();if(A){q();}if(i.addEventListener){if(i.touch){r.addEventListener("touchstart",v,false);}if(i.transitions){r.addEventListener("webkitTransitionEnd",v,false);r.addEventListener("msTransitionEnd",v,false);r.addEventListener("oTransitionEnd",v,false);r.addEventListener("otransitionend",v,false);r.addEventListener("transitionend",v,false);}window.addEventListener("resize",v,false);}else{window.onresize=function(){n();};}return{setup:function(){n();},slide:function(M,L){b(M,L);},prev:function(){t();y();},next:function(){t();h();},getPos:function(){return z;},stop:function(){t();},start:function(){q();},kill:function(){t();r.style[m]="auto";r.style[D]=0;var M=l.length;while(M--){var L=l[M];L.style[m]="100%";L.style[D]=0;if(i.transitions){g(M,0,0);}}if(i.addEventListener){r.removeEventListener("touchstart",v,false);r.removeEventListener("webkitTransitionEnd",v,false);r.removeEventListener("msTransitionEnd",v,false);r.removeEventListener("oTransitionEnd",v,false);r.removeEventListener("otransitionend",v,false);r.removeEventListener("transitionend",v,false);window.removeEventListener("resize",v,false);}else{window.onresize=null;}}};}if(window.jQuery||window.Zepto){(function(a){a.fn.Swipe=function(b){return this.each(function(){a(this).data("Swipe",new Swipe(a(this)[0],b));});};})(window.jQuery||window.Zepto);}