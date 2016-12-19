jQuery(window).scroll(function(){
    var scrollTop = jQuery(document).scrollTop();
    //console.log("scrollTop : " + scrollTop);
    if (scrollTop < 168) {
        scrollTop = 168;
    }
    jQuery("#header-wrapper").stop();
    jQuery("#header-wrapper").animate( { "top" : scrollTop });
});
