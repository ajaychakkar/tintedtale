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
        var _deltaX = innerCircle.centerX - _offsetX;
        var _deltaY = innerCircle.centerY - _offsetY;
    //  console.log(_deltaX , '  :: delta  X  ', _deltaY , '  :: delta Y');
        var _xFactor = 0;
        var _yFactor = 0;
        var _left = ( (innerCircle.centerX + _deltaX) - innerCircle.radius ) - _xFactor;
        var _top = (innerCircle.centerY + _deltaY) - innerCircle.radius;
        $(innerCircle.elem).css({
            'left': _left + 'px',
            'top':  _top + 'px',
        }); 
    }
    alert(alpha)
    
}  


function deviceSupport() {
    if(window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', motionEvent);       
    }
}
var alpha;
function motionEvent(e) {
    console.log(e);
    var x = e.acceleration.x;
    var y = e.acceleration.y;
    var z = e.acceleration.z;
                    
    alpha = e.rotationRate.alpha;
    var rbeta = e.rotationRate.beta;
    var rgamma = e.rotationRate.gamma;
}