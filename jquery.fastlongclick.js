// Copyright (C) 2012 Aphex Consulting Oy
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
// to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or
// substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
// PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

$(function () {
  var infos = [];
  var longclicklength = 1000;
  var moveTreshold = 25;
  var isTouch = false;
  var id = 1;
  var idFieldName = 'fastlongclick_id';
  
  function getKey(button) {
	  var buttonId = $.data(button, idFieldName) || id++;
	  $.data(button, 'fastlongclick_id', buttonId);
	  return buttonId;
  }

  function getInfo(button) {
	  var key = getKey(button);
	  var info = infos[key] || {fastclicks: [], longclicks: []};
	  infos[key] = info;
	  
	  // We can generate the handler only once, because $.off needs to have the exactly
	  // same function pointers to be able to disable the previous events.
	  if (!info.events) info.events = {
    	'mousedown.fastlongclick touchstart.fastlongclick': function(event) {
    	  if (event.type == 'touchstart') {
    	    isTouch = true;
    	  }
    	  if (isTouch && event.type == 'mousedown') return;
    	  info.down = {
    	    time: new Date().getTime(),
    	    x: event.type === 'mousedown' ? event.clientX : event.originalEvent.touches[0].pageX,
    	    y: event.type === 'mousedown' ? event.clientY : event.originalEvent.touches[0].pageY
        };
        if (info.longclicks.length > 0) {
          var self = this;
          info.timer = setTimeout(function(event){
    	      for(var i = 0; i < info.longclicks.length; i++) info.longclicks[i].call(self, event);
          },longclicklength);
        }
      },
      'mouseup.fastlongclick touchend.fastlongclick click.fastlongclick': function(event) {
    	  if (isTouch && event.type == 'mouseup') return;
  	    if (event.type === 'mouseup' && navigator.userAgent.match(/IEMobile/i)) return;
  	    
        if (info.down) {
    	    var duration = new Date().getTime() - info.down.time;
    	    if (info.longclicks.length == 0 || duration < longclicklength) {
    	      clearTimeout(info.timer);
            for(var i = 0; i < info.fastclicks.length; i++) {
              info.fastclicks[i].call(this, event);
            }
    	    }
    	    delete info.down;
        }
      },
      'mousemove.fastlongclick touchmove.fastlongclick touchcancel.fastlongclick': function(event) {
    	  if (event.type === 'touchmove' && info.longclicks.length > 0 && info.down) {
    	    event.preventDefault();
    	  }
    	  if (isTouch && event.type == 'mousemove') return;
        if (info.down) {
    	    var dx = info.down.x - (event.type === 'mousemove' ? event.clientX : event.originalEvent.touches[0].pageX);
    	    var dy = info.down.y - (event.type === 'mousemove' ? event.clientY : event.originalEvent.touches[0].pageY);
    	    var d = Math.sqrt(dx * dx + dy * dy);

    	    if (d > moveTreshold) {
    	      delete info.down;
    	      clearTimeout(info.timer);
    	    }
        }
      },
      'mouseout.fastlongclick': function(event) {
  	    if (info.down) {
  	      delete info.down;
  	      clearTimeout(info.timer);
  	    }
  	  }
	  };
	  return info;
  }
  
  $.fn.fastclick = function(next) {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var info = getInfo(button);
  	  info.fastclicks.push(next);
  		unregisterEvents(button, info);
  		registerEvents(button, info);
  	});
  };
  
  $.fn.longclick = function(next) {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var info = getInfo(button);
  	  info.longclicks.push(next);
  		unregisterEvents(button, info);
  		registerEvents(button, info);
  	});
  };

  $.fn.removefastclick = function(next) {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var info = getInfo(button);
  	  info.fastclicks.remove(next);
  		unregisterEvents(button, info);
  		registerEvents(button, info);
  	});
  }

  $.fn.removelongclick = function(next) {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var info = getInfo(button);
  	  info.longclicks.remove(next);
  		unregisterEvents(button, info);
  		registerEvents(button, info);
  	});
  }
	
  $.fn.removefastclicks = function() {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var info = getInfo(button);
  	  info.fastclicks = [];
  		unregisterEvents(button, info);
  		registerEvents(button, info);
  	});
  }

  $.fn.removelongclicks = function() {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var info = getInfo(button);
  	  info.longclicks = [];
  		unregisterEvents(button, info);
  		registerEvents(button, info);
  	});
  }

  $.fn.removefastlongclicks = function() {
  	return this.each(function() {
  	  var button = $(this)[0];
  	  var key = getKey(button);
  		if (infos[key]) {
  		  unregisterEvents(button, infos[key]);
  	    delete infos[key];
	    }
  	});
	}
	
	function unregisterEvents(button, info) {
	  $(button).off(info.events);
	}
	
	function registerEvents(button, info) {
	  $(button).on(info.events);
	};
});
