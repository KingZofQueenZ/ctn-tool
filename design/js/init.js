(function($){
  $(function(){

    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 300
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,    
    });
    $('.parallax').parallax(); 
    $('ul.tabs').tabs();


    
  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function() {

  $("#login-toggle").click(function(){
    if ($("#login-pane").is(":hidden")) {
      $("#login-pane").slideDown("slow");
    } else {
      $("#login-pane").slideUp("slow");
    }
  });

  $(document).mouseup(function(e) 
  {
      var container = $("#login-pane");
  
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
        $("#login-pane").slideUp("slow");
      }
  });


 });