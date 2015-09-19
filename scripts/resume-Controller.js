

$(function() {
	var smallDevice = false,
 		navFixed= false,
    	curPage = "#resume",
    	prevLink = $("#resumeLink"), 
     	lastScrollTop = 0,
    	mainContentTop = 0,
    	mainContent = $(".app-bottom-section"),
    	sectionHeight = [],
    	sectionOffsetValues = [],
    	widowHeight;


	function getPageContents() {
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
	}


	function detectDeviceType() {
		$(".device").each(function() {
			if($(this).css("display") == "none" && ($(this).hasClass("hidden-xs") || $(this).hasClass("hidden-sm"))) {
				smallDevice = true;
				return false;
			}
			else{
				smallDevice = false;

			}		
		});		

		widowHeight = $(this).height();		
	}


	function resonsiveProjectContent() {
		if(!smallDevice) {
			$(".project-content").each(function(){
				$(this).hover(function(){
					$(this).find(".project-text").stop(true, true).toggleClass("project-show-hover");
				});
			});
		
			$(".nav-container").removeClass("app-nav-fixed-top");

		}
		else{
			$(".project-content").each(function(){
				$(this).off("mouseenter mouseleave");
			});
		
			$(".nav-container").addClass("app-nav-fixed-top");		

		}
	}


	function getSectionScrollTop() {
		$(".mainContent").each(function() {
			sectionHeight.push($(this).height());
			sectionOffsetValues.push($(this).offset().top - 150); 
		});

	}


	function addListeners() {
		
		$(window).resize(function(){			
			detectDeviceType();
			resonsiveProjectContent();
		});


		$('a[href^="#"]').on('click', function(event) {

    		var offset = 0;
			if(smallDevice){
				$(".navbar-toggle").trigger("click");
				offset = 50;
			}
			else {
				offset = 150;
			}			

    		// var target = $(this.href);
    		var targetDiv = $(this).attr("href");
    		var target = $(targetDiv);

    		if( target.length ) {
        		event.preventDefault();

        		$('html, body').animate({
            		scrollTop: target.offset().top - offset
        		}, 1000);

				$(curPage).removeClass("main-content-in-focus"); 
				target.addClass("main-content-in-focus");
				$(prevLink).parent().removeClass("active");
				curPage = targetDiv;
				prevLink = $(this);
				$(prevLink).parent().addClass("active");
    		}
		});


   //  	$(".nav-link").click(function() {
   //  		var offset = 0;
			// if(smallDevice){
			// 	$(".navbar-toggle").trigger("click");
			// 	offset = 50;
			// }
			// else {
			// 	offset = 150;
			// }

			// $("#"+curPage).removeClass("main-content-in-focus");  
			// $(prevLink).parent().removeClass("active");
   //      	curPage=$(this).data("page");        
			// $('body').scrollTo("#"+curPage ,{duration: 1000, offsetTop : offset});
			// $("#"+curPage).addClass("main-content-in-focus");
			// prevLink = $(this);
			// $(prevLink).parent().addClass("active");

			// return false;
   //  	});

//SCROLL HANDLER
		$(window).scroll(function(event){
			var st = $(this).scrollTop();
			var sectionScrollIndex;
		   	
			if(!smallDevice){
			   	if(st >= 252 && !navFixed) {
			   		$(".nav-container").addClass("app-nav-fixed-top");
			   		navFixed = true;
			   	}
			   	if(st < 252 && navFixed) {
			   		$(".nav-container").removeClass("app-nav-fixed-top");
			   		navFixed = false;	   	
			   	}
			}

			var sectionStart, sectionEnd;
			sectionOffsetValues.forEach(function(offset, index) {
				sectionStart = offset;
				sectionEnd = sectionStart + sectionHeight[index];				
				if( st + 250 >= sectionStart && st <= sectionEnd) {
					sectionScrollIndex = index;				
					return false;
				}
			});

		   	// if ((st + 200) >= sectionOffsetValues[0] && (st + 200) < sectionOffsetValues[1] - 150) {
		   	// 	sectionScrollIndex = 0;
		   	// }

		   	// if ((st + 200) >= sectionOffsetValues[1] && (st + 200) < sectionOffsetValues[2] - 200) {
		   	// 	sectionScrollIndex = 1;
		   	// }

		   	// if ((st - 200) >= $(this).height()) {
		   	// 	sectionScrollIndex = 2;
		   	// }	

			$(".mainContent").each(function(index) {
				if( index === sectionScrollIndex ) {
					$(this).addClass("main-content-in-focus");
				}
				else {
					$(this).removeClass("main-content-in-focus");
				}

			});

			$("#app-collapsible-navbar  li").each(function(index){
				if( index === sectionScrollIndex ) {
					$(this).addClass("active");
				}
				else{
					$(this).removeClass("active");
				}
			});
		});

// END SCROLL HANDLER	

		resonsiveProjectContent();

		getSectionScrollTop();
	}

	getPageContents();
	detectDeviceType();

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


