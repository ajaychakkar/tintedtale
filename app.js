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
    if(BrowserDetect.any()) {
        $(mainCircle.elem).off('touchmove touchstart touchend').on('touchmove touchstart touchend', mouseMoveEvent);
    } else {
        $(mainCircle.elem).off('mousemove').on('mousemove', mouseMoveEvent);
        $(mainCircle.elem).off('mouseout').on('mouseout', mouseMoveEventmouseOutsideCircle);
    }
    
}

function mouseMoveEventmouseOutsideCircle(e) {
    moveInnerCircleToCenter();
}
function moveInnerCircleToCenter() {
    //setLeftTop(mainCircle.radius, mainCircle.radius);
    $(innerCircle.elem).animate({
        left:mainCircle.radius - innerCircle.radius,
        top: mainCircle.radius - innerCircle.radius
    }, 400, 'easeOutBounce');
}

function mouseMoveEvent(e) {
    $(innerCircle.elem).removeClass('moveTocenter');
    if(e.type == "touchmove" || e.type == "touchstart") {
        touch = true;
        e.pageX = e.originalEvent.touches[0].pageX;
        e.pageY = e.originalEvent.touches[0].pageY;
        clearInterval(interVal);
    }
    if(e.type == 'touchend') {
        touch = false;
        snappingToCenter = true;
        clearInterval(interVal);
        moveInnerCircleToCenter();
        resetvalues();
        setTimeout(function(){
            snappingToCenter = false;
            refreshValues();
        },1000);
    } else { 
        calculateMovePoint(e);
    }
    
}

function calculateMovePoint(e) {
    if(e.pageX >=  mainCircle.left && e.pageX <=  (mainCircle.left + mainCircle.width) && 
       e.pageY >=  mainCircle.top && e.pageY <=  (mainCircle.top + mainCircle.height)) {
        var _offsetX = e.pageX - mainCircle.left;
        var _offsetY = e.pageY - mainCircle.top;
        var _deltaX = _offsetX;
        var _deltaY = _offsetY;
        if(e.type == 'touchmove') {
            _x = _offsetX - mainCircle.radius;
            _y = _offsetY - mainCircle.radius;
        } 
        var temp = setInnerCircle(_deltaX , _deltaY);
        setLeftTop(temp.deltax, temp.deltay);
    }
}  
function setInnerCircle(_deltaX , _deltaY, ignoreValues) {
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
                _x = _deltaX;
                _y = _deltaY;
                return { deltax: _deltaX , deltay: _deltaY };
            } 
        } else {
            if(innerX > outerX && innerY > outerY) {
                _deltaX = outerX - innerCircle.radius * Math.cos(_angle);
                _deltaY = outerY - innerCircle.radius * Math.sin(_angle);
                _x = _deltaX;
                _y = _deltaY;
                return { deltax: _deltaX , deltay: _deltaY };
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
                _x = _deltaX;
                _y = _deltaY;
                return { deltax: _deltaX , deltay: _deltaY };
            } 
        } else {
            if(innerX < outerX && innerY > outerY) {
                _deltaX = outerX + innerCircle.radius * Math.cos(_angle);
                _deltaY = outerY + innerCircle.radius * Math.sin(_angle);
                _x = _deltaX;
                _y = _deltaY;
                return { deltax: _deltaX , deltay: _deltaY };
            } 
        }
    }
    if(ignoreValues) {
        return false;
    } else {
        return { deltax: _deltaX , deltay: _deltaY };
    }
    
    
}

function setLeftTop(_deltaX, _deltaY) {
    var _left =  _deltaX - innerCircle.radius;
    var _top = _deltaY - innerCircle.radius;
    $(innerCircle.elem).css({
        'left': _left + 'px',
        'top':  _top + 'px',
    });
}

function deviceSupport() {
    if(window.DeviceMotionEvent && BrowserDetect.any()) {
        window.addEventListener('devicemotion', motionEvent);    
        refreshValues();   
    }
}
function resetvalues() {
    velocityX = 0;
    velocityY = 0;
    _x = 0;
    _y = 0;
}
var alpha,beta, gamma, ax1,ay1,az1,ax,ay,az;
var velocityX = 0, velocityY = 0;
var _x = 0; _y = 0;
var prevAX, prevAY, signX;
var touch = false;
var snappingToCenter = false;
function motionEvent(e) {
    if(touch) {
        return;
    }
    if(snappingToCenter) {
        return;
    }
    ax1 = e.acceleration.x;
    ay1 = e.acceleration.y;
    az1 = e.acceleration.z;
    ax = e.accelerationIncludingGravity.x.toFixed(0);
    ay = e.accelerationIncludingGravity.y.toFixed(0);
    az = e.accelerationIncludingGravity.z;
    if((prevAX == 1 && ax < 0) || (prevAX == -1 && ax > 0)) {
        velocityX = 0;  
    }
    if((prevAY == 1 && ay < 0) || (prevAY == -1 && ay > 0)) {
        velocityY = 0;  
    }
                    
    alpha = e.rotationRate.alpha;
    beta = e.rotationRate.beta;
    gamma = e.rotationRate.gamma;
    if( ax != 0){
        velocityX = velocityX + (ax * 1);
        _x = _x - velocityX * 0.01;
    }
    if( ay != 0) {
        velocityY = velocityY + (ay * 1);
        _y = _y + velocityY * 0.01 ;
    }
    if(Math.sqrt((_x * _x) + (_y * _y)) > (mainCircle.radius - innerCircle.radius)) {
        setInnerCircle(mainCircle.radius + _x , mainCircle.radius + _y, true);
        _x = _x - mainCircle.radius;
        _y = _y - mainCircle.radius;
    }

    if(ax == 0 && ay == 0) {
        snappingToCenter = true;
        clearInterval(interVal);
        moveInnerCircleToCenter();
        resetvalues();
        setTimeout(function(){
            snappingToCenter = false;
            refreshValues();
        },1000);
    }

    if(ax > 0) {
        prevAX = 1;
    } else if(ax < 0){
        prevAX = -1;
    }

    if(ay > 0) {
        prevAY = 1;
    } else if(ay < 0){
        prevAY = -1;
    }
    
}
var interVal;
function refreshValues() {
    interVal = setInterval(function() {
        var str = 'x1=' + ax + '::  y1=' + ay + '::  z1=' + az + '<br> _x = ' + _x + ' :: _y= '+ _y;
        $('#test').html(str);
        var _temp = setInnerCircle(innerCircle.centerX + _x , innerCircle.centerY + _y);
        var _left = _temp.deltax;
        var _top = _temp.deltay;
        setLeftTop(_left , _top);
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
