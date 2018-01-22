(function($){
  $(function(){

    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 300
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,    
    });
    $('.parallax').parallax(); 
    $('ul.tabs').tabs();

    $('.carousel.carousel-slider').carousel({fullWidth: true});
    

    
  }); // end of document ready
})(jQuery); // end of jQuery name space
