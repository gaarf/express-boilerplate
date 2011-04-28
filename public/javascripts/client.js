jQuery(document).ready(function($) {


  console.log('hello world! jQuery v'+ $.fn.jquery);
  $('#main p').css({color:'orange'}).animate({'font-size':'333%', 'line-height':'.8'});

});