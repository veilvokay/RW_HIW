WebFontConfig = {
  google: {
    families: [
      "Roboto:200,300,400,500,600,700,800",
      "Open Sans:200,300,400,500,600,700,800",
    ],
  },
};

(function () {
  var wf = document.createElement("script");
  wf.src =
    ("https:" == document.location.protocol ? "https" : "http") +
    "://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
  wf.type = "text/javascript";
  wf.async = "true";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(wf, s);
})();
