var superSlides = (function() {
    var container;
    var gallery_list;
    var slides;

    var slideCount;
    var currentSlideId = -1;
    var currentSlide;
    var nextSlideTimeout;

    var thisobj;

    return {

        slideCount : function() { return slideCount; },

        currentSlideId : function() { return currentSlideId; },

        init : function() {
            thisobj = this;
            container = $('#home_gallery');
            gallery_list = $('ul', container);
            slides = $('.slide', container);
            slideCount = slides.length;

            var counter=0;
            slides.each(function() {
                $(this).attr('id', 'slide'+counter);
                counter+=1;
            }).hide();
            thisobj.nextSlide();
        },

        nextSlide: function () {
            console.log('next slide');
            currentSlideId = thisobj.getNextSlideId();
            thisobj.slideIn();
            thisobj.prepareForNextSlide();
        },

        prepareForNextSlide : function() {
            nextSlideTimeout = setTimeout(function() {
                thisobj.slideOut(function() {
                    thisobj.nextSlide();
                });
            }, 8000);
        },

        getNextSlideId : function() {
            return (currentSlideId + 1 >= slideCount) ? 0 : (currentSlideId+1);
        },

        currentSlide : function() {
            return $('#slide'+currentSlideId);
        },

        slideIn : function() {
            thisobj.animateItems('in');
        },

        slideOut : function(callback) {
            thisobj.animateItems('out', callback);
        },

        animateItems : function(inout, callback) {
            var currentSlide = thisobj.currentSlide();
            currentSlide.show();
            var itemCount = $('.item', currentSlide).length;
            var itemFinishedAnimation = 0;
            $('.item', currentSlide).each(function() {
                var altx = $(this).data('alt-x');
                var alty = $(this).data('alt-y');
                var x = $(this).data('x');
                var y = $(this).data('y');
                var width = $(this).data('width');
                var delay = $(this).data('delay');
                if (!delay) delay = 0;
                if (width) $(this).css('width', width);
                if (inout == 'in') {
                    if (altx) $(this).css('left', altx);
                    if (alty) $(this).css('top', alty);
                } else {
                    if (x) $(this).css('left', x);
                    if (y) $(this).css('top', y);
                }
                var toAnimate = this;
                setTimeout(function() {
                    if (inout == 'in') {
                        if (x) $(toAnimate).animate({ left: x }, 300);
                        if (y) $(toAnimate).animate({ top: y }, 300);
                    } else {
                        if (altx) $(toAnimate).animate({ left: altx }, 300);
                        if (alty) $(toAnimate).animate({ top: alty }, 300, function() {
                            thisobj.animateItemsCallback(++itemFinishedAnimation, itemCount, callback);
                        });
                    }
                }, delay);
            });
        },

        animateItemsCallback : function(a, b, callback) {
            if (a >= b && callback) {
                callback();
            }
        }

    }

})();