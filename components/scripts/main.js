// Initialize BootStrap Material Design
// $.material.init()

$(document).ready(function() {

  new WOW().init();

  $('body').scrollspy({
    target: '.dotted-scrollspy'
  });


  // Map for contacting me
  function init_map() {
      var var_location = new google.maps.LatLng(45.277792, -75.885912);

      var var_mapoptions = {
          center: var_location,
          zoom: 14,
          draggable: false,
          disableDoubleClickZoom: true,
          zoomControl: false,
          scaleControl: false,
          rotateControl: false,
          fullscreenControl: false,
          scrollwheel: false,
          navigationControl: false
      };

      var var_marker = new google.maps.Marker({
          position: var_location,
          map: var_map,
          title: "Ottawa"
      });

      var var_map = new google.maps.Map(document.getElementById("map-container"),
          var_mapoptions);

      var_marker.setMap(var_map);

  }
  google.maps.event.addDomListener(window, 'load', init_map);

  // Scroll To Top
  $('#bottom-socialmedia').click('on',function(e) {
    $(window).scrollTop(0);
  });
});
