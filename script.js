$(document).ready(function() {
    $(window).scroll(function() {
        if(this.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }
        if(this.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    })

    $('.scroll-up-btn').click(function() {
        $('html').animate({scrollTop: 0});
    })

    $('.menu-btn').click(function() {
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    })

    var typed = new Typed('.typing', {
        strings: [
            "łatwy w użyciu",
            "stworzony z miłości",
            "fajny",
            "uniwersalny",
            "wielo funkcjonalny",
            "nowoczesny",
        ],
        typeSpeed: 120,
        backSpeed: 80,
        loop: true,
    })

    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
                nav: false
            },
            600:{
                items: 2,
                nav: false
            },
            1000:{
                items: 3,
                nav: false
            }
        }
    });
});

function blokujMysz(event) {
    if (event.button === 2 || event.which === 3) {
        event.preventDefault();
    }
}

function blokujKlawisze(event) {
    if (event.key === 'F12') {
        event.preventDefault();
    }

    if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
    }
}

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

document.addEventListener('mousedown', blokujMysz);

document.addEventListener('keydown', blokujKlawisze);

document.addEventListener("DOMContentLoaded", function () {
    const featureRows = document.querySelectorAll(".feature-row");
 
    function revealFeatures() {
       featureRows.forEach((row, index) => {
          const position = row.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.3;
          
          if (position < screenPosition) {
             setTimeout(() => {
                row.classList.add("visible");
             }, index * 200);
          }
       });
    }
 
    window.addEventListener("scroll", revealFeatures);
    revealFeatures();
 });
