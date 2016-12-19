
$(document).ready(function(){
  $('.supfund').css("display","none")
  $('.suppcan').css("display","none")
  var comparator;
    $('.support_gift').click( function() {
    var index = $(".support_gift").index(this);
    if(index != comparator){
    comparator=index;
        $(".support_gift:eq(" + index + ") form").hide().slideDown('5');
        $(".support_gift:not(:eq(" + index + ")) form").slideUp('5');
      }})
var comparator2;
$('.sup_can').click( function() {
  if(comparator2){
    $(".sup_can form").slideUp('5');
    comparator2=false;
}else{
  $(".sup_can form").hide().slideDown('5');
    comparator2=true;
}
})

});
