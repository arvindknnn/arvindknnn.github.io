

$(function() {

	$.get("views/projects.html", function(data){
		$(".bodyDiv").append(data);
	});

	$.get("views/contact.html", function(data){
		$(".bodyDiv").append(data);
	});

    var curPage = "resumeDiv",
    	prevLink = $("#resumeLink");
    $(".nav-link").click(function() {
        if (curPage.length) { 
            $("#"+curPage).hide()
            $("#"+curPage).removeClass("main-content-in-focus");
        }
        curPage=$(this).data("page");
        $("#"+curPage).addClass("main-content-in-focus");
        prevLink.parent().removeClass("active");
        $(this).parent().addClass("active");
        prevLink = $(this);
        $("#"+curPage).fadeIn('slow');
    });

    var lastScrollTop = 0,
    	mainContentTop = 0,
    	mainContent = $(".app-bottom-section");
	$(window).scroll(function(event){
	   var st = $(this).scrollTop();
	   if (st > lastScrollTop){
	   		mainContentTop-=5;
	   		if(mainContentTop > -200){
	   			mainContent.attr("style","transform: translateY("+ mainContentTop +"px)");

	   		}
	   		else {
	   			mainContentTop = -200;
	   		}
	      
	   } else {
	   		mainContentTop+=5;

	   		if(mainContentTop < 0) {
	   			mainContent.attr("style","transform: translateY("+ mainContentTop +"px)");
	   		}
	   		else {
	   			mainContentTop = 0;
	   		}
	       // console.log("up");
	      
	   }
	   lastScrollTop = st;
	});





});