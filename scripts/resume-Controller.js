

$(function() {
    var curPage="workDiv";
    $("a").click(function() {
        if (curPage.length) { 
            $("#"+curPage).hide();
        }
        curPage=$(this).data("page");
        $("#"+curPage).fadeIn('slow');
    });
});