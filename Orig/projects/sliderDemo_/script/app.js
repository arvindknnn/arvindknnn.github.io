'use strict';

angular.module('myApp',['slider'])
.controller('appctrl', ['$scope', function ($scope) {
	$scope.zoomDemo = {
		zoomValue: 0.7,
		zoomPercentage: 70,
		zoomDemoClass: "zoom-demo-wrapper-expanded",
		zoomSliderConf: {
			type: "range", // options: data, range
			min: 0.1,
			max: 1.5,
			start: 0.7,
			step: 0.05,
			spacing: "auto", //options: equated, auto
			displayticks: false,
			displayguide: true,
			changeable: true,
			callback: function(data){
				$scope.zoomDemo.zoomValue = data.val;
				$scope.zoomDemo.zoomPercentage = Math.floor($scope.zoomDemo.zoomValue * 100);				
			}
		}		
	};

	$scope.dataDemo = {
		dataSliderDemoClass: "data-slider-wrapper-collapsed",
		dataSliderReturn: {},
		dataSliderConf: {
			type: "data", // options: data, range
			min: 0,
			max: 100,
			step: 10,
			start: 20,
			model: [1,20,90,800, 400],
			spacing: "auto", //options: equated, auto
			displayticks: true,
			displayguide: true,
			changeable: true,
			callback: function(data){
				$scope.dataDemo.dataSliderReturn = data;
			}
		}
	};	

	$scope.footerLink = "More Demos";

	$scope.creditDemo = {
		creditSliderConf: {
			type: "range", // options: data, range
			min: 300,
			max: 850,
			start: 500,
			step: 50,
			spacing: "auto", //options: equated, auto
			displayticks: true,
			displayguide: true,
			changeable: false,
			callback: function(data){
				// console.log($scope.zoomValue * 100);
			},
			rangeData: function(data) {
				$scope.creditDemo.creditRangeData = data;
			}
		}
	};
	
	$scope.toggleDemo = function() {
		if($scope.zoomDemo.zoomDemoClass === "zoom-demo-wrapper-collapsed") {
			$scope.zoomDemo.zoomDemoClass = "zoom-demo-wrapper-expanded";
			$scope.dataDemo.dataSliderDemoClass = "data-slider-wrapper-collapsed";
			$scope.footerLink = "More Demos";
		}
		else {
			$scope.zoomDemo.zoomDemoClass = "zoom-demo-wrapper-collapsed";
			$scope.dataDemo.dataSliderDemoClass = "data-slider-wrapper-expanded";
			$scope.footerLink = "Back to Wall-E Zoom Demo";
		}
		return false;
	};
	
}]);