$(document).ready(function(){function e(){var e=new google.maps.LatLng(45.3452,(-75.918986)),o={center:e,zoom:14},t=new google.maps.Marker({position:e,map:n,title:"Ottawa"}),n=new google.maps.Map(document.getElementById("map-container"),o);t.setMap(n)}(new WOW).init(),$("body").scrollspy({target:".dotted-scrollspy"}),google.maps.event.addDomListener(window,"load",e)});