/*! diaboscroll v 0.1 ~ (c) 2014 Dingoogle */
(function (window, document, Math) {
	var defaults = {
		startAt: 0,
		duration: 400,
		offsetNum: 0,
		verticalAlign: 'middle'
	};
	/**
	 * get the usable transition style and relevant event
	 * if the browser supports none of them
	 * return false
	 */
	var usableEvent = (function(){
		var elStyle = document.createElement("div").style,
			transEventMap = {
				'-webkit-transition': 'webkitTransitionEnd',
				'transition': 'transitionend',
				'-o-transition': 'oTransitionEnd',
				'-ms-transition': 'msTransitionEnd'
			};		
		for(var itm in transEventMap){
			if(itm in elStyle)
			{
				return {
					"cssName":itm,
					"eventName": transEventMap[itm]
				}
			}
		}
		return false;
	})();
	var hasTouch = 'ontouchstart' in window;
	
	var utils = {
		getChildElement: function(els){
			var chldrn = [];
			for(var itm in els){
				if (els[itm].nodeType == 1){
					chldrn.push(els[itm]);
				}
			}
			return chldrn;
		},
		extend: function (target, obj) {		
			for ( var i in obj ) {
				if(target[i] != undefined){
				}
				else{
					target[i] = obj[i];
				}
			}
		}
	}
	
	
	function DiaboSlider (el, options) {
		
		options = options || {};
		var initialized = false;
		var self = this;
		var dslider = {};
		var $el = this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
		this.scroller = dslider.scroller = utils.getChildElement(this.wrapper.children)[0];
		
		this.init = function(){
			utils.extend(options, defaults);
			console.log(options)
			initialized = false;
			dslider.children = utils.getChildElement(dslider.scroller.children);
			dslider.currentIndex = 0;
			if(!dslider.children.length)
				return;
			if(options.offsetNum > dslider.children.length){
				options.offsetNum = 0;
			}
			dslider.itemSize = {width:dslider.children[0].offsetWidth, height:dslider.children[0].offsetHeight};
			dslider.wrapperSize = {width:$el.clientWidth, height:$el.clientHeight}; 
			dslider.zeroPosition = {x:0,y:0};
			dslider.positions = [];
			self.currentIndex = options.startAt;
			switch (options.verticalAlign){
				case "top":
					dslider.zeroPosition.y = -(options.offsetNum * dslider.itemSize.height);
				break;
				case "bottom":
					dslider.zeroPosition.y = -(options.offsetNum * dslider.itemSize.height) + dslider.wrapperSize.height - dslider.itemSize.height;
				break;
				case "middle":
					dslider.zeroPosition.y = -(options.offsetNum * dslider.itemSize.height) + (dslider.wrapperSize.height - dslider.itemSize.height)/2;
				default:
				
				break;
			}
			
			dslider.currentPosition = {x:dslider.zeroPosition.x, y:dslider.zeroPosition.y};
			dslider.originTouchPos = {x:0,y:0};			
			initialized = true;
		}
		
		/**
		 * create shadow items and add to dom
		 */
		var createShadowItems = function(num){		
			// clone last as first shadow;	
			num = num;
			num = num >= dslider.children.length?dslider.children.length:num;
			dslider.firstShadows = [];
			dslider.lastShadows = [];
			for(var i=0;i<num;i++){
				var fd = dslider.children[dslider.children.length-1-i].cloneNode(true);
				dslider.scroller.insertBefore(fd,dslider.scroller.children[0]);
				dslider.firstShadows.push(fd);
				var ed =  dslider.children[i].cloneNode(true);
				dslider.scroller.appendChild(ed);
				dslider.lastShadows.push(ed);
			}
		};
		/**
		 * remove shadow items
		 */
		var removeShadowItems = function(){	
			//console.log("remove", dslider.firstShadows)
			if(dslider.firstShadows && dslider.firstShadows.length){			
				
				for(var i=0;i<dslider.firstShadows.length;i++){
					dslider.scroller.removeChild(dslider.firstShadows[i]);
					dslider.scroller.removeChild(dslider.lastShadows[i]);
				}
				
				dslider.firstShadows = [];
				dslider.lastShadows = [];
			}
		};
		
		/**
		 * add event listeners for touch events
		 * add "touchstart","touchmove" and "touchend" event handlers
		 */
		var addTouchEventListener = function(){			
			dslider.scroller.addEventListener(hasTouch?"touchstart":"mousedown", touchStartHandler);
			dslider.scroller.addEventListener(hasTouch?"touchend": 'mouseup', touchEndHandler);	
			dslider.scroller.addEventListener(hasTouch?"touchcancel": 'mouseout', touchEndHandler);
			dslider.scroller.addEventListener('webkitTransitionEnd', webkitTransitionEndHandler);
		}
		
		/**
		 * remove event listeners for touch events
		 * remove "touchstart","touchmove" and "touchend" event handlers in case they has been added
		 */
		var removeTouchEventListener = function(){	
			dslider.scroller.removeEventListener(hasTouch? "touchstart": "mousedown", touchStartHandler);			
			dslider.scroller.removeEventListener(hasTouch?"touchend": 'mouseup', touchEndHandler);	
			dslider.scroller.removeEventListener(hasTouch?"touchcancel": 'mouseup mouseout', touchEndHandler);
		}
		/**
		 * event handler of "touchstart"
		 * @param value (event)
		 *  - the event of touchstart
		 */
		
		var touchStartHandler = function(e){
			dslider.scroller.addEventListener(hasTouch?'touchmove':'mousemove',touchMoveHandler);
			isTouchMoving = true;
			var touch = hasTouch?e.touches[0] || e.changedTouches[0]:e;		
			dslider.originTouchPos = getRelativePosition(touch);
			if(dslider.currentIndex == dslider.totalSlidersNum-1){	
				dslider.scroller.style.cssText = "position:absolute;left:" + 0 + "px;";							
			}
			dslider.desiredIndex = dslider.currentIndex;
		};
		
		/**
		 * event handler of "touchmove"
		 * @param value (event)
		 *  - the event of touchmove
		 */
		var prevPosition = 0;
		var speed = 0;
		var dur = options.duration;
		var touchMoveHandler = function(e){
			// prevent default event behavior
			e.preventDefault();
			var touch = hasTouch?e.touches[0] || e.changedTouches[0]:e;
			var pos = getRelativePosition(touch);
			var x = 0, y = 0;
			speed = pos.y - prevPosition;
			dslider.verticalDistance = pos.y - dslider.originTouchPos.y;
			var movedX = Math.abs(pos.x - dslider.originTouchPos.x);			
			var movedY = Math.abs(pos.y - dslider.originTouchPos.y);
			//console.log(pos.y +"," + dslider.originTouchPos.y +", "+ dslider.currentPosition)
			y = pos.y - dslider.originTouchPos.y + dslider.currentPosition.y;
			//console.log("Y: " ,dslider.originTouchPos.y);
			//console.log(dslider.currentPosition);
			dslider.scroller.style.top = y + "px";
			var newindex = calculateIndex(y) - Math.floor(speed/5);
			newindex = newindex<0?0:newindex;
			newindex = newindex>= dslider.children.length-1? dslider.children.length-1:newindex;
			dslider.desiredIndex = newindex;
			dur = Math.floor(Math.abs(200 + options.duration/speed*2));
			console.log(dur)
			prevPosition = pos.y;
		};
		/**
		 * event handler of "touchend"
		 * @param value (event)
		 *  - the event of touchend
		 */
		var touchEndHandler = function(e){
			
			var touch = hasTouch?e.touches[0] || e.changedTouches[0]: e;			
			var pos = getRelativePosition(touch);
			//console.log("top: "+ dslider.scroller.style.top)
			dslider.currentPosition = {y: parseInt(dslider.scroller.style.top), x:  parseInt(dslider.scroller.style.left)};	
			var moveDistance = Math.abs(dslider.originTouchPos.y - dslider.currentPosition.y);
			console.log(dslider.originTouchPos.y - pos.y)
			var dir = (dslider.originTouchPos.y - pos.y>=0)?1:-1;
			dslider.scroller.removeEventListener(hasTouch?'touchmove':'mousemove',moveDistance);
			
			//dslider.scroller.style.top = p + "px";
			//gotoIndex(dslider.currentIndex, moveDistance);
			//gotoIndex();
			// short cut
			/*
			if(Math.abs(dslider.desiredIndex - dslider.currentIndex)>= dslider.children.length - options.offsetNum){
				
				if(dslider.desiredIndex < dslider.currentIndex){
					dslider.currentIndex = dslider.desiredIndex + options.offsetNum
				}else{
					dslider.currentIndex = dslider.currentIndex + options.offsetNum
				}
				console.log(dslider.positions[dslider.currentIndex])
				console.log(dslider.positions[dslider.desiredIndex])
				//gotoIndex(dslider.currentIndex);
				console.log("desiredIndex " + dslider.desiredIndex + ", currentIndex " +  dslider.currentIndex)
			}
			*/

			
			moveTo(dslider.desiredIndex, dir);	
			
		};
		
		var webkitTransitionEndHandler = function(e){		
			gotoIndex(dslider.currentIndex);
			var evt = document.createEvent('CustomEvent'); 
			evt.initEvent("selectedUpdate", true, true);
			evt.eventType = 'message';  
			evt.selectedIndex = dslider.currentIndex || 0;
			self.currentIndex = dslider.currentIndex;		
			self.wrapper.dispatchEvent(evt);			
		};
		
		/**
		 * return the position of touch event relative to slider.
		 * @param value (object)
		 *  - touch event instance
		 */
		var getRelativePosition = function(touch){
			var elm = $el.getBoundingClientRect();
			var x = touch.pageX - elm.left;
			var y = touch.pageY - elm.top;
			return {x:x, y:y};
		};
		var calculateIndex = function(pos){
			var len = dslider.positions.length, cindex;	
			var	num = len-options.offsetNum*2;
			cindex = Math.floor(((dslider.zeroPosition.y + dslider.itemSize.height*options.offsetNum) - pos + dslider.itemSize.height/2)/dslider.itemSize.height);
			cindex = cindex<0?0:cindex;
			cindex = cindex>= len-1?len-1:cindex;	
			cindex = cindex - options.offsetNum;
			cindex = cindex<0?cindex+num:cindex;
			cindex = cindex>=num?cindex-num:cindex;
			return cindex;	
					
		};
		/**
		 * return position of specified page
		 * @param value (int)
		 *  - the page index
		 */
		var getPositionByIndex = function (index, dir){
			var res = -dslider.positions[index] + dslider.zeroPosition.y;
			// the last one
			/*
			if((index== dslider.totalSlidersNum-1) && dslider.orientation>0){
				res = -cgslider.positions[0];				
			}
			if(index==0 && dslider.orientation<0){
			//	res = -dslider.positions[dslider.totalSlidersNum+1];				
			}
			if(index == dslider.currentIndex){
				res = -dslider.positions[index+1];
			}
			*/
			
			return res;
		};
		/**
		 * move from start index to end index in animation
		 * @param value (int)
		 *  - the start index
		 * @param value (int)
		 *  - the end index
		 */
		var moveTo = function(end, dir){	
			console.log("start: " + dslider.currentIndex + "; " + end + "; dir: "+ dir)
			var desiredPos = getPositionByIndex(end, dir), p = 0;	
			if(dslider.currentIndex == 0 && dir<0){
				p = (dslider.children.length * dslider.itemSize.height);
			}
			if(dslider.currentIndex == dslider.children.length-1 && dir>0){
				p = -(dslider.children.length * dslider.itemSize.height);
			}
			
			if(usableEvent){
				dslider.scroller.style[usableEvent.cssName] = "top " + dur/1000 + "s ease-out";
				dslider.scroller.style.top = desiredPos + p + "px";		
				dslider.currentIndex = end;
			}else{
				gotoIndex(end);
			}
			dslider.currentPosition.y = desiredPos;		
			
		};		
		var gotoIndex = function(index, offset){
		//	console.log("offset: "+ (dslider.zeroPosition.y - dslider.positions[index]))
			dslider.scroller.style.top = dslider.zeroPosition.y - dslider.positions[index] + (offset?offset:0) + "px";
			dslider.scroller.style.webkitTransition = '';
			//console.log(dslider.scroller.style.top)
			self.currentIndex = dslider.currentIndex = index;
		};
		
		var startup = function(){
			self.init();
			if(!initialized)
				return;
			createShadowItems(options.offsetNum);
			//console.log(utils.getChildElement(dslider.scroller.children))
			var cldrn = utils.getChildElement(dslider.scroller.children);
			for(var i=0;i<cldrn.length;i++){
				dslider.positions[i] =  (dslider.itemSize.height)*(i);
			};
			//console.log(dslider.positions)
			addTouchEventListener();
			gotoIndex(options.startAt);
		}
		
		this.refresh = function(){
			//removeShadowItems();
			removeEventListener();
			dslider.initialized = false;
			dslider.children = [];
			dslider.positions = [];
			self.currentIndex = dslider.currentIndex = options.startAt;
			startup();
		}
		startup();
	};
	
	DiaboSlider.prototype = {
		version: "0.1.0"		
	};
	DiaboSlider.prototype.bind = function(eventType, func){
		this.wrapper.addEventListener(eventType, func);
	};
	DiaboSlider.prototype.refresh = function(){
		this.refresh();
	};
	
	if ( typeof module != 'undefined' && module.exports ) {
		module.exports = DiaboSlider;
	} else {
		window.DiaboSlider = DiaboSlider;
	}
})(window, document, Math);