

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


	function setEmailResponse(messageCode) {

			if (messageCode === 1) {
				var messageResult = $("#contact .message-result");
				messageResult.removeClass("hidden");
				messageResult.removeClass("alert-danger");
				messageResult.addClass("alert-success");
				messageResult.text("Thanks for your message");
				setTimeout(function() {
					messageResult.addClass("hidden");
				}, 5000);				
			}

			if (messageCode === -1) {
				var messageResult = $("#contact .message-result");
				messageResult.removeClass("alert-success");
				messageResult.removeClass("hidden");
				messageResult.addClass("alert-danger");
				messageResult.text("Something snapped..your message was not sent. Please try calling me :)");
				setTimeout(function() {
					messageResult.addClass("hidden");
				}, 5000);	
			}		

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
				curPage = targetDiv;
    		}
		});


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

			$(".mainContent").each(function(index) {
				if( index === sectionScrollIndex ) {
					$(this).addClass("main-content-in-focus");
				}
				else {
					$(this).removeClass("main-content-in-focus");
				}

			});

			$("#app-collapsible-navbar  li").each(function(index){
				if( index !== sectionScrollIndex ) {
					$(this).removeClass("active");
				}
				else{
					$(this).addClass("active");
				}
			});
		});

// END SCROLL HANDLER	
		$(".btn-send-email").click( function() {
			var data = {};
			data.name = $(".txt-name").val();
			data.email = $(".txt-email").val();
			data.msg = $(".txt-msg").val();
			var dataString = "name=" + data.name + "&email=" + data.email + "&msg=" + data.msg;


			$(".txt-name").val("");
			$(".txt-email").val("");
			$(".txt-msg").val("");			

			$.ajax({
				url: "mail/ajaxsubmit.php",
				type: "POST",
				data: dataString,
				dataType: "jsonp",
				callback: "cb"
			}).done( function(message) {
				console.log(message.responseText);
				setEmailResponse(JSON.parse(message.responseText).code);	
				

			}).fail( function(error) {
				console.log(error.responseText);						
				setEmailResponse(JSON.parse(error.responseText).code);					
			});

		});




		resonsiveProjectContent();

		getSectionScrollTop();
	}

	getPageContents();
	detectDeviceType();

});


