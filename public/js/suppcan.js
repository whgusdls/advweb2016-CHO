
$(document).ready(function(){
  $('.supfund').css("display","none")
  var comparator
    $('.support_gift').click( function() {
    var index = $(".support_gift").index(this);
    if(index != comparator){
    comparator=index;
        $(".support_gift:eq(" + index + ") form").hide().slideDown('5');
        $(".support_gift:not(:eq(" + index + ")) form").slideUp('5');
      }})

});
