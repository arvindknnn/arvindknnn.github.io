

$(function() {
	var smallDevice = false;

	$.get("views/resume.html", function(data) {
		$(".bodyDiv").append(data);		
	}).done(function(){
		$.get("views/projects.html", function(data){
			$(".bodyDiv").append(data);
		}).done(function(){
			$.get("views/contact.html", function(data){
				$(".bodyDiv").append(data);
			}).done(addListeners);
		});		
	});

	$(".device").each(function() {
		if($(this).css("display") == "none" && ($(this).hasClass("hidden-xs") || $(this).hasClass("hidden-sm"))) {
			smallDevice = true;
		}

	});

    var curPage = "resumeDiv",
    	prevLink = $("#resumeLink");
    $(".nav-link").click(function() {
		$("#"+curPage).removeClass("main-content-in-focus");  
		$(prevLink).parent().removeClass("active");
        curPage=$(this).data("page");        
		$('body').scrollTo("#"+curPage ,{duration: 1000, offsetTop : '50'});
		$("#"+curPage).addClass("main-content-in-focus");
		prevLink = $(this);
		$(prevLink).parent().addClass("active");

		return false;

    });

//SCROLL HANDLER
 //    var lastScrollTop = 0,
 //    	mainContentTop = 0,
 //    	mainContent = $(".app-bottom-section");
 	var navFixed= false;
	$(window).scroll(function(event){
	   var st = $(this).scrollTop();
	   // console.log(st);
	   if(st >= 252 && !navFixed) {
	   	$(".nav-container").addClass("app-nav-fixed-top");
	   	navFixed = true;
	   }
	   if(st < 252 && navFixed) {
	   	$(".nav-container").removeClass("app-nav-fixed-top");
	   	navFixed = false;	   	
	   }



	   // if (st > lastScrollTop){
	   // 		mainContentTop-=5;
	   // 		if(mainContentTop > -200){
	   // 			mainContent.attr("style","transform: translateY("+ mainContentTop +"px)");

	   // 		}
	   // 		else {
	   // 			mainContentTop = -200;
	   // 		}
	      
	   // } else {
	   // 		mainContentTop+=5;

	   // 		if(mainContentTop < 0) {
	   // 			mainContent.attr("style","transform: translateY("+ mainContentTop +"px)");
	   // 		}
	   // 		else {
	   // 			mainContentTop = 0;
	   // 		}
	   //     // console.log("up");
	      
	   // }
	   // lastScrollTop = st;
	});

// END SCROLL HANDLER


	function addListeners() {
		if(!smallDevice) {
			$(".project-content").each(function(){
				$(this).hover(function(){
					$(this).find(".project-text").stop(true, true).toggleClass("project-show-hover");
				});
			});
		}
	}


	// $("#emailSend").on("click", function(){
	// 	alert("clicked");
		// $.ajax({
		// 	type:"POST",
		// 	url:"http://localhost:8888/MAMP/mail/mail.php",
		// 	dataType: "jsonp",
		// 	success: function(result){
		// 		alert(result);
		// 	}

		// 	}).done(function(data){
		// 		 console.log(data);
		// 	}).fail(function(data){ 
		// 		console.log(data);
		// 	});
	// });





});