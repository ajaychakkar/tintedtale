 var Activity = function() {
    console.log('inside activity');
    
	//================================================================================
	// PUBLIC FUNCTIONS
	//================================================================================
	this.init = function(_obj) {
	}
	//================================================================================
	this.addEventListener = function(_evt, _fun) {
		p[_evt] = _fun;
	}
};
var mainCircle = {}, innerCircle = {};
window.onload = function() {    
    mainCircle.elem = $('#main-circle');
    innerCircle.elem = $('#inner-circle');
    getCircleDimension();
    setMouseEvent();
    deviceSupport();
    //refreshValues();
};
window.addEventListener('resize', getCircleDimension);
function getCircleDimension() {
    //  main circle dimensions
    var _mainCircleOffset = $(mainCircle.elem).offset();
    mainCircle.left = _mainCircleOffset.left;
    mainCircle.top = _mainCircleOffset.top;
    mainCircle.width = $(mainCircle.elem).width();
    mainCircle.height = mainCircle.elem[0].getBoundingClientRect().height;
    mainCircle.radius = mainCircle.width / 2;
    mainCircle.centerX = mainCircle.left + mainCircle.radius;
    mainCircle.centerY = mainCircle.top + mainCircle.radius;

    //  inner circle dimensions
    innerCircle.width = $(innerCircle.elem).width();
    innerCircle.radius = innerCircle.width / 2;
    innerCircle.centerX = mainCircle.radius;
    innerCircle.centerY = mainCircle.radius;
    //console.log(innerCircle.centerX , '  :: ',innerCircle.centerY);
}

function setMouseEvent() {
    $(mainCircle.elem).off('mousemove touchmove touchstart').on('mousemove touchmove touchstart', mouseMoveEvent);
}

function mouseMoveEvent(e) {
    if(e.type == "touchmove" || e.type == "touchstart") {
        e.pageX = e.originalEvent.touches[0].pageX;
        e.pageY = e.originalEvent.touches[0].pageY;
    }
    calculateMovePoint(e);
}
function calculateMovePoint(e) {
    if(e.pageX >=  mainCircle.left && e.pageX <=  (mainCircle.left + mainCircle.width) && 
       e.pageY >=  mainCircle.top && e.pageY <=  (mainCircle.top + mainCircle.height)) {
        var _offsetX = e.pageX - mainCircle.left;
        var _offsetY = e.pageY - mainCircle.top;
        var _deltaX = _offsetX;
        var _deltaY = _offsetY;
        var _angle = Math.atan((_deltaY - mainCircle.radius) / (_deltaX - mainCircle.radius));
        if(mainCircle.radius < _deltaX ) {
            var outerX = mainCircle.radius + Math.cos(_angle) * mainCircle.radius;
            var outerY = mainCircle.radius + Math.sin(_angle) * mainCircle.radius;
            var innerX = _deltaX + Math.cos(_angle) * innerCircle.radius;
            var innerY = _deltaY + Math.sin(_angle) * innerCircle.radius;
            if(mainCircle.radius > _deltaY) {
                if(innerX > outerX && innerY < outerY) {
                    _deltaX = outerX - innerCircle.radius * Math.cos(_angle);
                    _deltaY = outerY - innerCircle.radius * Math.sin(_angle);
                } 
            } else {
                if(innerX > outerX && innerY > outerY) {
                    _deltaX = outerX - innerCircle.radius * Math.cos(_angle);
                    _deltaY = outerY - innerCircle.radius * Math.sin(_angle);
                } 
            }
        } else {
            var outerX = mainCircle.radius - Math.cos(_angle) * mainCircle.radius;
            var outerY = mainCircle.radius - Math.sin(_angle) * mainCircle.radius;
            var innerX = _deltaX - Math.cos(_angle) * innerCircle.radius;
            var innerY = _deltaY - Math.sin(_angle) * innerCircle.radius;
            if(mainCircle.radius > _deltaY) {
                if(innerX < outerX && innerY < outerY) {
                    _deltaX = outerX + innerCircle.radius * Math.cos(_angle);
                    _deltaY = outerY + innerCircle.radius * Math.sin(_angle);
                } 
            } else {
                if(innerX < outerX && innerY > outerY) {
                    _deltaX = outerX + innerCircle.radius * Math.cos(_angle);
                    _deltaY = outerY + innerCircle.radius * Math.sin(_angle);
                } 
            }
        }
        var _left =  _deltaX - innerCircle.radius
        var _top = _deltaY - innerCircle.radius;
        $(innerCircle.elem).css({
            'left': _left + 'px',
            'top':  _top + 'px',
        });
    }
}  

function deviceSupport() {
    if(window.DeviceMotionEvent && BrowserDetect.any()) {
        window.addEventListener('devicemotion', motionEvent);    
        refreshValues();   
    }
}
var alpha,beta, gamma, ax1,ay1,az1,ax,ay,az;
var velocityX = 0, velocityY = 0;
var _x = 0; _y = 0;
function motionEvent(e) {
    ax1 = e.acceleration.x;
    ay1 = e.acceleration.y;
    az1 = e.acceleration.z;
    ax = e.accelerationIncludingGravity.x.toFixed(1);
    ay = e.accelerationIncludingGravity.y.toFixed(1);
    az = e.accelerationIncludingGravity.z;
                    
    alpha = e.rotationRate.alpha;
    beta = e.rotationRate.beta;
    gamma = e.rotationRate.gamma;
    if( ax != 0){
        velocityX = velocityX + (ax * 0.01);
        _x = _x + velocityX * 0.01 + 0.5 * ax * 0.01 *0.01;
    }
    if( ay != 0) {
        velocityY = velocityY + (ay * 0.01);
        _y = _y + velocityY * 0.01 + 0.5 * ay * 0.01 *0.01;
    }
    
}
function refreshValues() {
    setInterval(function() {
        var str = 'x=' + ax1 + '::  y=' + ay1 + '::  z=' + az1 + '<br>  x1=' + ax + '::  y1=' + ay + '::  z1=' + az + '<br>  alpha=' + alpha + '::  beta=' + beta +'::  gamma=' + gamma + '<br> _x = ' + _x + ' :: _y= '+ _y;
        $('#test').html(str);
        var _xFactor = 0;
        var _yFactor = 0;
        var _left = ( (innerCircle.centerX + _x) - innerCircle.radius ) - _xFactor;
        var _top = (innerCircle.centerY + _y) - innerCircle.radius;
        $(innerCircle.elem).css({
            'left': _left + 'px',
            'top':  _top + 'px',
        }); 
    },10);
}
//=============================================================================
var BrowserDetect = {
	Android: function() {
		return navigator.userAgent.match(/Android/i) ? true : false;
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) ? true : false;
	},
	Windows_surface: function() {
		return navigator.userAgent.match(/Trident/i) && navigator.userAgent.match(/Tablet/i)  ? true : false;
	},
	ChromeBook: function () {
		return navigator.userAgent.match(/\bCrOS\b/i) ? true : false;
	},
	OsDetect:function(){
		var OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
		return OSName;
	},
	WindowsTouch:function(){
		return (BrowserDetect.OsDetect()==="Windows" && navigator.maxTouchPoints >0);
	},
	any: function() {
		return (BrowserDetect.Android() || BrowserDetect.BlackBerry() || BrowserDetect.iOS() || BrowserDetect.Windows());
	},
	ie9: function() {
		return navigator.userAgent.match(/MSIE 9.0/i) ? true : false;
	},
	ie10: function() {
		return navigator.userAgent.match(/MSIE 10.0/i) ? true : false;
	},
	ie: function() {
		return navigator.userAgent.match(/MSIE/i) || navigator.userAgent.match(/Trident/i) ? true : false;
	},
	FF: function() {
		return typeof InstallTrigger !== 'undefined';
	},
	safari: function() {
		return navigator.userAgent.match(/Safari/i) ? true : false;
	}
};