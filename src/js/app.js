import "./_webfont";

$(function () {
  // Scroll to - builder
  function scrollTo(from, delay) {
    $(`${from}`).click(function (e) {
      e.preventDefault();
      let currentLink = $(this).attr("href");
      if (currentLink === "#") {
        console.log(false);
        return;
      } else {
        $([document.documentElement, document.body]).animate(
          {
            scrollTop: $(`${currentLink}`).offset().top,
          },
          delay
        );
      }
    });
  }

  $(window).bind("scroll", function () {
    if ($(window).scrollTop() > 50) {
      $(".header-hiw").addClass("fixed-nav");
      $(".navbar-nav").removeClass("bg");
    } else {
      $(".header-hiw").removeClass("fixed-nav");
      $(".navbar-nav").addClass("bg");
    }
  });

  $(".btn-aside").on("click", function () {
    $(this).toggleClass("open");
  });

  // Calling functions
  scrollTo(".nav-link", 1000);
  new WOW().init();
});
