var Activity = function () {
    console.log('inside activity');

    //================================================================================
    // PUBLIC FUNCTIONS
    //================================================================================
    this.init = function (_obj) {}
    //================================================================================
    this.addEventListener = function (_evt, _fun) {
        p[_evt] = _fun;
    }
};
var mainCircle = {},
    innerCircle = {};
window.onload = function () {
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
    innerCircle.currentX = mainCircle.radius / 2;
    innerCircle.currentY = mainCircle.radius / 2;
    innerCircle.velocity = 0;
    innerCircle.r = 0;
    //console.log(innerCircle.centerX , '  :: ',innerCircle.centerY);
}

function setMouseEvent() {
    if (BrowserDetect.any()) {
        $(mainCircle.elem).off('touchmove touchstart touchend').on('touchmove touchstart touchend', mouseMoveEvent);
    } else {
        $(innerCircle.elem).off('mousedown').on('mousedown', mouseDownEvent);
    }
}

function mouseDownEvent(e) {
    if (e.type == 'mousedown') {
        if (e.pageX >= mainCircle.left && e.pageX <= (mainCircle.left + mainCircle.width) &&
            e.pageY >= mainCircle.top && e.pageY <= (mainCircle.top + mainCircle.height)) {
            $(document).off('mousemove mouseup').on('mousemove mouseup', calculateMovePoint);
        }
    }
}

function calculateAngle() {
    var _x = innerCircle.currentX - mainCircle.radius;
    var _y = innerCircle.currentY - mainCircle.radius;
    innerCircle.distance = Math.sqrt(_x * _x + _y * _y);
    innerCircle.angle = Math.atan2(_y, _x);
    //console.log(innerCircle.angle / Math.PI * 180) 
}

var innerCircleInterval;

function resetInnerCircleVelocity() {
    innerCircle.velocity = 0;
    clearInterval(innerCircleInterval);
    innerCircleInterval = null;
}

function moveInnerCircleToCenter(_callback) {
    var k = 10;
    var time = 0.05;
    var f = -k * innerCircle.distance;
    innerCircle.velocity = innerCircle.velocity + f * time;
    //console.log(f , ' :: f');
    //console.log(innerCircle.velocity , ' :: velocity');
    innerCircle.distance = innerCircle.distance + innerCircle.velocity * time + 0.5 * f * time * time;
    //console.log(innerCircle.angle , ' :: innerCircle.angle');
    var x = mainCircle.radius + innerCircle.distance * Math.cos(innerCircle.angle);
    var y = mainCircle.radius + innerCircle.distance * Math.sin(innerCircle.angle);
    innerCircle.currentX = x;
    innerCircle.currentY = y;
    //console.log(x , '  :: x   ::  y  :: ', y);
    //console.log(innerCircle.velocity , '  :: innerCircle.velocity')
    setLeftTop(x, y);
    if (innerCircle.distance < 2 && Math.abs(innerCircle.velocity) <= 0.05) {
        resetInnerCircleVelocity();
        if (_callback) {
            _callback();
        }
    }
}

function mouseMoveEvent(e) {
    if (e.type == "touchmove" || e.type == "touchstart") {
        touch = true;
        e.pageX = e.originalEvent.touches[0].pageX;
        e.pageY = e.originalEvent.touches[0].pageY;
        resetInnerCircleVelocity();
        clearInterval(interVal);
    }

    if (e.type == 'touchend') {
        touch = false;
        startSpringAnimationOndevice();
    } else {
        calculateMovePoint(e);
    }
}

function calculateMovePoint(e) {
    resetInnerCircleVelocity();
    if (e.type == 'mouseup') { // this condition is for device
        $(document).off('mousemove mouseup');
        calculateAngle();
        innerCircleInterval = setInterval(function () {
            moveInnerCircleToCenter();
        }, 1);
    }

    var _offsetX = e.pageX - mainCircle.left;
    var _offsetY = e.pageY - mainCircle.top;
    var _deltaX = _offsetX;
    var _deltaY = _offsetY;
    if (e.type == 'touchmove') {
        _x = _offsetX - mainCircle.radius;
        _y = _offsetY - mainCircle.radius;
    }
    var temp = setInnerCircle(_deltaX, _deltaY);
    innerCircle.currentX = temp.deltax;
    innerCircle.currentY = temp.deltay;
    setLeftTop(temp.deltax, temp.deltay);
}

function documentMouseMove(e) {
    if (e.pageX >= mainCircle.left && e.pageX <= (mainCircle.left + mainCircle.width) &&
        e.pageY >= mainCircle.top && e.pageY <= (mainCircle.top + mainCircle.height)) {
        var _offsetX = e.pageX - mainCircle.left;
        var _offsetY = e.pageY - mainCircle.top;
        var _deltaX = _offsetX;
        var _deltaY = _offsetY;
        if (e.type == 'touchmove') {
            _x = _offsetX - mainCircle.radius;
            _y = _offsetY - mainCircle.radius;
        }
        var temp = setInnerCircle(_deltaX, _deltaY);
        innerCircle.currentX = temp.deltax;
        innerCircle.currentY = temp.deltay;
        setLeftTop(temp.deltax, temp.deltay);
    }
}

function setInnerCircle(_deltaX, _deltaY, ignoreValues) {
    var _angle = Math.atan((_deltaY - mainCircle.radius) / (_deltaX - mainCircle.radius));
    if (mainCircle.radius < _deltaX) { // right side of main circle 
        var outerX = mainCircle.radius + Math.cos(_angle) * mainCircle.radius;
        var outerY = mainCircle.radius + Math.sin(_angle) * mainCircle.radius;
        var innerX = _deltaX + Math.cos(_angle) * innerCircle.radius;
        var innerY = _deltaY + Math.sin(_angle) * innerCircle.radius;
        if (mainCircle.radius > _deltaY) { // bottom side 
            if (innerX > outerX && innerY < outerY) {
                _deltaX = outerX - innerCircle.radius * Math.cos(_angle);
                _deltaY = outerY - innerCircle.radius * Math.sin(_angle);
                if (ignoreValues) {
                    _x = _deltaX;
                    _y = _deltaY;
                }
                return {
                    deltax: _deltaX,
                    deltay: _deltaY
                };
            }
        } else { // top side
            if (innerX > outerX && innerY > outerY) {
                _deltaX = outerX - innerCircle.radius * Math.cos(_angle);
                _deltaY = outerY - innerCircle.radius * Math.sin(_angle);
                if (ignoreValues) {
                    _x = _deltaX;
                    _y = _deltaY;
                }
                return {
                    deltax: _deltaX,
                    deltay: _deltaY
                };
            }
        }
    } else { // left side
        var outerX = mainCircle.radius - Math.cos(_angle) * mainCircle.radius;
        var outerY = mainCircle.radius - Math.sin(_angle) * mainCircle.radius;
        var innerX = _deltaX - Math.cos(_angle) * innerCircle.radius;
        var innerY = _deltaY - Math.sin(_angle) * innerCircle.radius;
        if (mainCircle.radius > _deltaY) { // bottom side
            if (innerX < outerX && innerY < outerY) {
                _deltaX = outerX + innerCircle.radius * Math.cos(_angle);
                _deltaY = outerY + innerCircle.radius * Math.sin(_angle);
                if (ignoreValues) {
                    _x = _deltaX;
                    _y = _deltaY;
                }
                return {
                    deltax: _deltaX,
                    deltay: _deltaY
                };
            }
        } else { // top side
            if (innerX < outerX && innerY > outerY) {
                _deltaX = outerX + innerCircle.radius * Math.cos(_angle);
                _deltaY = outerY + innerCircle.radius * Math.sin(_angle);
                if (ignoreValues) {
                    _x = _deltaX;
                    _y = _deltaY;
                }
                return {
                    deltax: _deltaX,
                    deltay: _deltaY
                };
            }
        }
    }
    if (ignoreValues) {
        return false;
    } else {
        return {
            deltax: _deltaX,
            deltay: _deltaY
        };
    }


}

function setLeftTop(_deltaX, _deltaY) {
    var _left = _deltaX - innerCircle.radius;
    var _top = _deltaY - innerCircle.radius;
    $(innerCircle.elem).css({
        'left': _left + 'px',
        'top': _top + 'px',
    });
}


//=========== code for deivce motion ==============
function deviceSupport() {
    if (window.DeviceMotionEvent)
        if (BrowserDetect.iOS()) {
            window.DeviceMotionEvent.requestPermission()
                .then(function (response) {
                    if (response == 'granted') {
                        addDeviceMotionEvent();
                    }
                }).catch(console.error)
        } else if (BrowserDetect.any()) {
            addDeviceMotionEvent()
    }
}

function addDeviceMotionEvent() {
    window.addEventListener('devicemotion', motionEvent);
    refreshValues();
}

function resetvalues() {
    velocityX = 0;
    velocityY = 0;
    _x = 0;
    _y = 0;
}
var alpha, beta, gamma, ax1, ay1, az1, ax, ay, az;
var velocityX = 0,
    velocityY = 0;
var _x = 0;
_y = 0;
var prevAX, prevAY, signX;
var touch = false;
var snappingToCenter = false;

function motionEvent(e) {
    if (touch) {
        return;
    }
    if (snappingToCenter) {
        return;
    }
    ax = e.acceleration.x.toFixed(1);
    ay = e.acceleration.y.toFixed(1);
    az = e.acceleration.z.toFixed(1);
    //ax = e.accelerationIncludingGravity.x.toFixed(0);
    //ay = e.accelerationIncludingGravity.y.toFixed(0);
    //az = e.accelerationIncludingGravity.z;
    if ((prevAX == 1 && ax < 0) || (prevAX == -1 && ax > 0)) {
        velocityX = 0;
    }
    if ((prevAY == 1 && ay < 0) || (prevAY == -1 && ay > 0)) {
        velocityY = 0;
    }

    alpha = e.rotationRate.alpha;
    beta = e.rotationRate.beta;
    gamma = e.rotationRate.gamma;
    if (ax != 0) {
        velocityX = velocityX + (ax * 1);
        _x = _x - velocityX * 1.0;
    }
    if (ay != 0) {
        velocityY = velocityY + (ay * 1);
        _y = _y + velocityY * 1.0;
    }
    if (Math.sqrt((_x * _x) + (_y * _y)) > (mainCircle.radius - innerCircle.radius)) {
        setInnerCircle(mainCircle.radius + _x, mainCircle.radius + _y, true);
        _x = _x - mainCircle.radius;
        _y = _y - mainCircle.radius;
        //$('#test').html(_x + ' _x  :: _y  ' + _y);
    }

    if (Math.abs(ax) < 0.15 && Math.abs(ay) < 0.15) { // condition for when accelaration stop
        startSpringAnimationOndevice();
    }

    if (ax > 0) {
        prevAX = 1;
    } else if (ax < 0) {
        prevAX = -1;
    }

    if (ay > 0) {
        prevAY = 1;
    } else if (ay < 0) {
        prevAY = -1;
    }

}
var interVal;

function startSpringAnimationOndevice() {
    snappingToCenter = true;
    clearInterval(interVal);
    resetvalues();
    resetInnerCircleVelocity();
    calculateAngle();
    innerCircleInterval = setInterval(function () {
        moveInnerCircleToCenter(function () {
            snappingToCenter = false;
            refreshValues();
        });
    }, 1);
}

function refreshValues() {
    interVal = setInterval(function () {
        // var str = 'ax=' + ax + '::  ay=' + ay + '::  az=' + az + '<br> _x = ' + _x + ' :: _y= '+ _y;
        //  $('#test').html(str);
        var _temp = setInnerCircle(innerCircle.centerX + _x, innerCircle.centerY + _y);
        var _left = _temp.deltax;
        var _top = _temp.deltay;
        innerCircle.currentX = _temp.deltax;
        innerCircle.currentY = _temp.deltay;
        setLeftTop(_left, _top);
    }, 10);
}