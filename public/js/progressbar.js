$(document).ready(function(){
    $('.progress').css("display","none")
var slider;
  $('.pr').on({
      mouseleave: function () { $(this).children("div.progress").slideUp('5'); },
      mouseenter: function () { $(this).children("div.progress").hide().slideDown('5'); }
  });
});
