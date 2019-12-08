// Initialize BootStrap Material Design
// $.material.init()

$(document).ready(function() {

  new WOW().init();

  $('body').scrollspy({
    target: '.dotted-scrollspy'
  });

  // Scroll To Top
  $('#bottom-socialmedia').click('on',function(e) {
    $(window).scrollTop(0);
    // row bow
  });

  // Toggle Light / Dark Theme

  $('#themeToggle').click(function(){
    if (this.innerText === "DARK") {
      // MAKE DARK
      this.innerText = "Light";
      
      $("html").css({"height":"100%", "background-color":"rgba(33,33,33, 1)", "color":"whitesmoke"});
      $("body").css({"height":"100%", "background-color":"rgba(33,33,33, 1)", "color":"whitesmoke"});
      $(".view").css({"height":"100%", "background-color":"rgba(33,33,33, 1)", "color":"whitesmoke"});
      $(".card-body").css({"background": "rgba(22,22,22,1)", "color": "whitesmoke"});
      $(".modal-content").css({"background-color": "rgba(33,33,33,1)"});
      $(".close").css({"color": "whitesmoke"});
      $("hr").css({"height": "1px", "color":"whitesmoke","background-color": "whitesmoke","border": "none"});
      $(".top-nav-collapse").css({"background-color": "#394046"});
      
    } else {
      // REMOVE DARK
      this.innerText = "Dark";

      $("html").removeAttr("style");
      $("body").removeAttr("style");
      $(".view").removeAttr("style");
      $(".card-body").removeAttr("style");
      $(".modal-content").removeAttr("style");
      $(".close").removeAttr("style");
      $("hr").removeAttr("style");
      $(".top-nav-collapse").removeAttr("style");
      
    }
  });

  // Haptic Sound Hover
  var audio = $("#haptic-sound")[0];
  audio.volume = 0.05;
  console.log(audio);
  $(".img-modal").mouseenter(function() {
    audio.play();
  });

  // Haptic Sound Mouse Click
  var audio2 = $("#haptic-sound-click")[0];
  audio2.volume = 0.05;
  console.log(audio);
  document.body.addEventListener('click', function() {
    audio2.play();
  }, true); 
  
});
