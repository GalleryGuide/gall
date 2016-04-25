$(function(){
  // Add focus class for keyboard menu navigation.
  $('.menu-item a').on('focus', function () {
    $(this).closest('.menu-item').toggleClass('has-focus');
  });

});