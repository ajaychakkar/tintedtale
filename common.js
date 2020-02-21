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

//================================================================================
//================================================================================
//================================================================================
// GlobalAnimClass is accepts objects
// id: Required to stop the particular animation.
// fps (optional): Frame per second.
// delay (optional): if delay given then fps will not work.
// start (optional): Callback when the animation starts.
// frame (optional): Callback when the animation is playing.
// stop (optional): Callback when the animation stops.
//================================================================================
var GlobalAnimClass = function()
{
    var animObjects = new Object();
    var _thisObj = this;
	var animPlaying = false;
	var requestId;
	//================================================================
    this.start = function(_obj)
	{
		if(_obj.id)
		{
			animObjects[_obj.id] = _obj;
			if(!_obj.immediate)
			{
				animObjects[_obj.id].oldDate = new Date();
			}
			animObjects[_obj.id].start ? animObjects[_obj.id].start() : null;
		}
        if(!animPlaying)
		{
			animPlaying = true;
			enterFrame();
		}
    }
	//================================================================
    this.stop = function(_id)
	{
		if (_id)
		{
			if(animObjects[_id])
			{
				animObjects[_id].stop ? animObjects[_id].stop() : null;
				animObjects[_id] != undefined ? delete animObjects[_id] : null;
			}
		}
		if(objectSize(animObjects) == 0)
		{
			animPlaying = false;
			cancelAnimationFrame(requestId);
		}
    }
	//================================================================
	 this.setFps = function(_id,_fps)
	{
		if (_id)
		{
			if(animObjects[_id])
			{
				animObjects[_id].fps = _fps; 
			}
		}
		
    }
	//================================================================
    function enterFrame()
	{
        var _newDate = new Date();
        //--------------------------
		for(var i in animObjects)
		{
			if(typeof animObjects[i] != "undefined")
			{
				if(animObjects[i].delay != undefined)
				{
					if(typeof(animObjects[i].oldDate) == "undefined" || (_newDate - animObjects[i].oldDate) >= animObjects[i].delay)
					{
						animObjects[i].oldDate = _newDate;
						animObjects[i].frame ? animObjects[i].frame(i) : null;
					}
				}
				else if(animObjects[i].fps != undefined)
				{
					if(typeof(animObjects[i].oldDate) == "undefined" || _newDate - animObjects[i].oldDate >= (1000/animObjects[i].fps))
					{
						animObjects[i].oldDate = _newDate;
						animObjects[i].frame ? animObjects[i].frame(i) : null;
					}
				}
			}
		}
		//--------------------------
		if(animPlaying)
		{
        	requestId = requestAnimationFrame(enterFrame);
		}
    }
	//================================================================
	function objectSize(obj)
	{
		var size = 0, key;
		for (key in obj)
		{
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};
	//================================================================
	//================================================================
	(function()
	{
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
		{
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element)
		{
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function()
			{
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id)
		{
			clearTimeout(id);
		};
	}());
	//================================================================
	//================================================================
}
var globalAnimClassObject = new GlobalAnimClass();
