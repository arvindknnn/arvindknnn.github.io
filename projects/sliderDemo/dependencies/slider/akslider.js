'use strict';

// Declare app level module which depends on views, and components
angular.module('slider', ['template/slider/akslider.html'])
.directive("akSlider", ['$document','$window', function ($document, $window) {

//TODO: 
// 1. Remove usage of JQuery
// 2. Add two sliders
// 3. Option to not add any ticks and display slide % above ball (like volume slider)
// 4. Accept config and data from attributes
// 5. Remove inline css styles in the template (inserting later is ok)

	return {
		restrict: 'E',
		scope: {
			
			config: "="
	
		},
		 templateUrl: "template/slider/akslider.html",
		 link: function(scope, elem){


		 	var sliderConf = {
			 	type: scope.config.type,
			 	changeable: scope.config.changeable,
			 	model: scope.config.model,
			 	min: scope.config.min,
			 	max: scope.config.max,
			 	start: scope.config.start,
			 	step: scope.config.step,
			 	spacing: scope.config.spacing,
			 	rangeCallback: scope.config.rangeData,
			 	displayTicks: scope.config.displayticks,
			 	displayguide: scope.config.displayguide,
			 	callback: scope.config.callback
			 };	
		 	 scope.down= false;
			 scope.movex= "0px";	
			 scope.transformSpeed= 800;
			 scope.trackTransformSpeed = '800ms';
			 scope.ngslideContainer= "cursor-default";
			 scope.ngsliderBall= "slider-ball-up";
			 scope.data= [];
			 scope.tickWidth= [];
			 // scope.model= [1,20,90,500, 200];
			 scope.model = sliderConf.model;
			 scope.step= 1;
			 scope.trackBarWidth = 0;
			 scope.elemWidth;
			 scope.returnToCallback = {};

			 // scope.sliderticksclass = (sliderConf.displayTicks) ? ticks-visisble : ticks-hidden;
			 

			 
			

			 try{
			 	if (sliderConf.type == "data" && (!(sliderConf.model) || !(sliderConf.model.length))) {
			 		throw new GetError(1);
			 	}

			 	if (sliderConf.type == "range" && ((sliderConf.min === undefined) || !(sliderConf.max) || !(sliderConf.step))) {
			 		throw new GetError(2);
			 	}


			 if (sliderConf.type == "range") {
			 	sliderConf.model = [];
			 	for (var i = sliderConf.min; i <= sliderConf.max; i=i+sliderConf.step ) {

			 		sliderConf.model.push(i);
			 	}
			 	if (sliderConf.model[sliderConf.model.length - 1] != sliderConf.max) {
			 		sliderConf.model.push(sliderConf.max);
			 	}
			 		
			 		// if(typeof(sliderConf.rangeCallback) === "function") {
			 		// 	sliderConf.rangeCallback(sliderConf.model);	
			 		// }		 		
			 }	

			 if (sliderConf.type == "data" ) {
			 	sliderConf.min = Math.min.apply(Math, scope.model);
		 	 	sliderConf.max = Math.max.apply(Math, scope.model);

			 }



			function GetError (type) {

				switch(type){
					case 1:
						this.message = "config.model should be provided for config.type = data";
						this.errorType = "Config Error";
						break;
					case 2:
						this.message = "config.min, config.max and config.step should be provided for config.type = range";
						this.errorType = "Config Error";
						break;						
	
				}
				return {type: this.errorType, message: this.message};
			}


		 	scope.elemWidth = elem[0].firstElementChild.offsetWidth - 40;

			 scope.$watch(function() {
			 		return elem[0].firstElementChild.offsetWidth - 40;
			 	}, function(data) {
			 		// console.log ("pos: " + scope.movex);
			 		scope.elemWidth = data;
			 		scope.updateTicks();
			 		var pos = Number(scope.movex.substring(0, scope.movex.length - 2));
			 		scope.movex = calcCurrentPos(pos + 30).currentPos + "px";	
		 			scope.trackBarWidth = scope.movex;				 				 

			 	});



		 		scope.sliderDown = function ($event) {
		 			if(sliderConf.changeable){
			 			$event.preventDefault();
			 			scope.down = true;
			 			scope.transformSpeed = 0;
			 			scope.trackTransformSpeed = '0ms';
			 			scope.ngslideContainer = "cursor-pointer";
			 			scope.ngsliderBall = "slider-ball-down" ;
		 			// scope.slide($event);
		 			}
		 		};

		 		scope.sliderUp = function ($event) {
		 			$event.preventDefault();
		 			if (scope.down) {
		 				var eventPos = $event.clientX - 30;	 	
		 				scope.ngslideContainer = "cursor-default";
		 				scope.ngsliderBall = "slider-ball-up";
		 				scope.transformSpeed = 800;
		 				scope.trackTransformSpeed = '800ms';
		 				scope.movex = calcCurrentPos($event.x).currentPos + "px";
		 				scope.trackBarWidth = scope.movex;
		 				scope.down = false;
		 				callbackCaller(eventPos);	

		 			}
		 		};

		 		// While dragged using slider anchor
		 		scope.slide = function ($event) {		 			 
		 			$event.preventDefault();			 			
		 			var eventPos = $event.clientX - 30;	 
		 			if (eventPos < 0 ) { eventPos = 0;};		 				
		 			if(scope.down && (eventPos) <= scope.elemWidth) {
		 				// console.log($event.clientX - 30);
		 				scope.movex = (eventPos || 0) + "px";	
		 				scope.trackBarWidth = scope.movex;	
		 				callbackCaller(eventPos);			 				 
		 			}						
		 		};

		 		//When clicked on a tick or on a position on the slider bar
		 		scope.slideTo = function ($event, speed) {
		 			$event.preventDefault();
		 			if(sliderConf.changeable){
			 			var eventPos = $event.clientX - 30;		 			
			 			scope.transformSpeed = 800;
			 			scope.trackTransformSpeed = '800ms';
			 			scope.movex = calcCurrentPos($event.x).currentPos + "px";
			 			scope.trackBarWidth = scope.movex;
			 			callbackCaller(eventPos);			 				 
		 			}
		 		};

				scope.updateTicks = function(){
		 			var element = {};
		 			var tickPos, 
		 				tickPix, 
		 				tickLen = sliderConf.model.length;
		 			sliderConf.model.sort(function(a, b){return a-b;});
		 			sliderConf.model.forEach(function (tick, index) {
		 				element = {};
		 				if (sliderConf.spacing === "equated") {
		 					if (index === 0) {
		 						tickPos = 0;	
		 						tickPix = 0;	
		 					}
		 					else if (index === tickLen - 1) {
		 						tickPos = 100;	
		 						tickPix = scope.elemWidth;	
		 					}
		 					else {
		 					tickPos = (100 / (tickLen - 1)) * (index);	
		 					tickPix = (scope.elemWidth / (tickLen - 1)) * (index);
		 					}	
		 				}

		 				if (sliderConf.spacing === "auto") {	
		 						tickPos = ((tick - sliderConf.min)/(sliderConf.max - sliderConf.min)) * 100;	
		 						tickPix = ((tick - sliderConf.min)/(sliderConf.max - sliderConf.min)) * scope.elemWidth;
		 						// console.log("width: " + scope.elemWidth + " tickPos: " + tickPos + " tickPix: " + tickPix + " value: " + tick);		 						
		 					
	
		 					if (sliderConf.start > sliderConf.model[index-1] && sliderConf.start <= sliderConf.model[index]) {
		 						scope.movex = tickPix + "px";
			 					// scope.trackBarWidth = scope.movex;
		 					}
		 				}

		 				element.value = tick;
		 				element.width = tickPos;
		 				element.position = tickPix;
		 				scope.data.push(element);	
		 				scope.tickWidth.push(tickPix);
		 			});

		 		};

		 		scope.generateTicks = function(){
		 			var element = {};
		 			var tickPos, 
		 				tickPix, 
		 				tickLen = sliderConf.model.length;		 			 
		 			sliderConf.model.sort(function(a, b){return a-b;});
		 			sliderConf.model.forEach(function (tick, index) {
		 				element = {};
		 				if (sliderConf.spacing === "equated") {
		 					if (index === 0) {
		 						tickPos = 0;	
		 						tickPix = 0;	
		 					}
		 					else if (index === tickLen - 1) {
		 						tickPos = 100;	
		 						tickPix = scope.elemWidth;	
		 					}
		 					else {
		 						tickPos = (100 / (tickLen - 1)) * (index);	
		 						tickPix = (scope.elemWidth / (tickLen - 1)) * (index);
		 					}	
		 				}

		 				if (sliderConf.spacing === "auto") {
		 					if(index === 0) {
		 						tickPos = 0;	
		 						tickPix = 0;			 						
		 					}
		 					else {
		 						tickPos = (tick/(sliderConf.max - sliderConf.min)) * 100;	
		 						tickPix = (tick/(sliderConf.max - sliderConf.min)) * scope.elemWidth;
		 						console.log("width: " + scope.elemWidth + " tickPos: " + tickPos + " tickPix: " + tickPix + " value: " + tick);		 							 						
		 					}
	
		 					if (sliderConf.start > sliderConf.model[index-1] && sliderConf.start <= sliderConf.model[index]) {
		 						scope.movex = tickPix + "px";
		 					}
		 				}

		 				element.value = tick;
		 				element.width = tickPos;
		 				element.position = tickPix;
		 				scope.data.push(element);	
		 				scope.tickWidth.push(tickPix);
		 			});		 			
		 		};

		 		// scope.generateTicks();


		 		function calcCurrentPos (eventPos) {
		 			var ticksLength = scope.tickWidth.length,
		 				position = {};
		 			
		 			// Check if the slider slides to below left bound and reset it
		 				
		 			if (eventPos < scope.tickWidth [0]) {
		 				position.currentPos = scope.tickWidth [0];
		 				position.dataPos = scope.tickWidth [0];

		 			}

		 			// Check if the slider slides to beyond right bound and reset it

		 			else if (eventPos > scope.tickWidth [ticksLength - 1]) {
		 				position.currentPos = scope.tickWidth[ticksLength - 1];
		 				position.dataPos = scope.tickWidth[ticksLength - 1];

		 			}

		 			// Check if the slider is dropped between two ticks. If beyond midway between two ticks, 
		 			// drop at higher tick. If below midway between two ticks, drop at lower tick

		 			else {
						for (var index = 0; index < ticksLength; index++) {
			 				if ((eventPos - 30) < scope.tickWidth[index]) {
			 					if ((eventPos - 30) > ((scope.tickWidth[index -1]) + ((scope.tickWidth[index] - (scope.tickWidth[index -1])) / 2)))	{
			 						// scope.movex = scope.tickWidth[index] + "px";
			 						position.currentPos = scope.tickWidth[index];
		 							position.dataPos = scope.tickWidth[index];

			 						break;			 						
			 					}
			 					else {
			 						// scope.movex = scope.tickWidth[index - 1] + "px";
			 						position.currentPos = scope.tickWidth[index - 1];
			 						position.dataPos = scope.tickWidth[index - 1];

			 						break;	
			 					}			 				
			 				}			 				
			 			}	
		 			}	 		
		 			return position;
		 		}

		 		function callbackCaller(eventPos) {
		 			if (eventPos < 0 ) { eventPos = 0;};
		 			if (eventPos >= scope.elemWidth) { eventPos = scope.elemWidth;}
		 			scope.returnToCallback.val = (eventPos * (sliderConf.max - sliderConf.min)/scope.elemWidth) + sliderConf.min;
		 			scope.returnToCallback.slidePos = scope.movex;
		 			 sliderConf.callback(scope.returnToCallback);
		 		}

		} catch(e){
			 	
			 	console.log(e.message);
			}

		}
	};
}]);

angular.module("template/slider/akslider.html", []).run(["$templateCache", function ($templateCache) {
	$templateCache.put("template/slider/akslider.html",
		'<div class="slideContainer cursor-default" ng-mouseup= "sliderUp($event)" ng-mousemove="slide($event)" ng-mouseleave="sliderUp($event)" ng-class="ngslideContainer"> \n' +
		// '<div class="slideContainer cursor-default" ng-mouseup= "sliderUp($event)" ng-mouseleave="sliderUp($event)" ng-class="ngslideContainer"> \n' +
		// '<div class="sliderGuide" ng-show="config.displayguide"> {{movex}} <div> \n' +
		'<div id="__sliderTrack" class="sliderTrack" ng-click="slideTo($event, 500)"> \n' +
		'<div style="height: 100%; width: {{ trackBarWidth}}; background-color: blue; transition: width {{trackTransformSpeed}} "></div> \n' +
		'<div class="draggable" ng-mousedown="sliderDown($event)" style="transform: translateX({{movex}}) translateZ(100px); transition: transform {{transformSpeed}}ms" ng-class="ngsliderBall"></div> \n' +
		'</div> \n' +
		'<div class="sliderTicks"> \n' +
		'<div ng-repeat="tik in data track by $index" style="position: absolute; float: left; left: {{tik.width}}%" ng-show= "config.displayticks" ng-click="slideTo($event, 500)"> <span style="cursor:pointer">{{tik.value}} </span></div> \n' +
		'</div> \n' +
		'</div> \n' +
		'');
}]);



// .controller("slideControl",["$scope", function ($scope) {
// 	$scope.down = false;	
// 	$scope.movex = "0px";	
// 	$scope.transformSpeed = 0;
// 	$scope.ngslideContainer = "cursor-default";
// 	$scope.ngsliderBall = "slider-ball-up";
// 	$scope.model = [1,20,90,5,500, 200];
// 	$scope.step = 1;
// 	$scope.data = [];
// 	$scope.tickWidth = [];
// 	$scope.sliderDown = function () {
// 		$scope.down = true;
// 		$scope.transformSpeed = 0;
// 		$scope.ngslideContainer = "cursor-pointer";
// 		$scope.ngsliderBall = "slider-ball-down" ;
// 	};
// 	$scope.sliderUp = function () {
// 		$scope.down = false;
// 		$scope.ngslideContainer = "cursor-default";
// 	};
// 	$scope.slide = function ($event) {
// 		// console.log($scope.down);
// 		if($scope.down){
// 			$scope.movex = ( $event.clientX - 30)+ "px";			
// 			// console.log($scope.movex);
// 		}

		
// 	};
// 	$scope.slideTo = function (pos, speed) {
// 		$scope.transformSpeed = speed;
// 		$scope.movex = pos + "px";			

// 	};

// /*************DEFECTS IDENTIFIED************
// 1. Clicking on track slides the ball to either extermes before moving to the correct position
// 2. Clicking on the ball while already on a tick moves it to next position

// */





// 	$scope.slideOver = function ($event, speed, item) {
// 		$scope.ngsliderBall = "slider-ball-up";
// 		$scope.transformSpeed = speed;
// 		var moveX = [];
// 		if (item == "track") {
// 			moveX.push({pos: ($event.clientX - 30)  + "px", speed: 800});							
// 		}	
// 		for (var index = 0; index < $scope.tickWidth.length; index++) {
// 			if (($event.clientX - 30) < $scope.tickWidth[index] ) {
// 				moveX.push({pos: $scope.tickWidth[index]  + "px", speed: 1200});				
// 				break;
// 			}
// 		}
// 		moveX.forEach(function (move) {
// 			$scope.transformSpeed = move.speed;
// 			$scope.movex = move.pos;
// 		});
// 	};

// 	$scope.generateTicks = function(){
// 		var min = Math.min.apply(Math, $scope.model);
// 		var max = Math.max.apply(Math, $scope.model);
// 		var guage = angular.element(".sliderTicks").width();
// 		// console.log("max " + max + " guage " + guage );
// 		$scope.model.forEach(function (tick) {
// 			var element = {};
// 			var tickPos = (tick/max) * guage;			
// 			element.value = tick;
// 			element.width = tickPos;
// 			// console.log("tick# " + tick + " | tick width " + tickPos);
// 			$scope.data.push(element);	
// 			$scope.tickWidth.push(tickPos);	
// 		});

// 	};

// 	$scope.generateTicks();

// }])
