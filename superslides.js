/*
 * superslides.js
 * Author: Irwan Setiawan
 */
(function($){

    $.fn.superSlides = function(options) {

        var settings = $.extend({
            delay : 8000
        }, options );

        var gallery_list;
        var slides;

        var slideCount;
        var currentSlideId = -1;
        var currentSlide;
        var nextSlideTimeout;

        var init = function(container) {
            gallery_list = $('ul', container);
            slides = $('li', container);
            slideCount = slides.length;

            var counter=0;
            slides.each(function() {
                $(this).attr('id', 'slide'+counter);
                counter+=1;
            }).hide();
            nextSlide();
        };

        var nextSlide = function () {
            currentSlideId = getNextSlideId();
            slideIn();
            prepareForNextSlide();
        };

        var getCurrentSlide = function () {
            return $('#slide'+currentSlideId);
        };

        var prepareForNextSlide = function() {
            nextSlideTimeout = setTimeout(function() {
                slideOut(function() {
                    getCurrentSlide().hide();
                    nextSlide();
                });
            }, settings.delay);
        };

        var getNextSlideId = function() {
            return (currentSlideId + 1 >= slideCount) ? 0 : (currentSlideId+1);
        };

        var slideIn = function() {
            animateItems('in');
        };

        var slideOut = function(callback) {
            animateItems('out', callback);
        };

        var animateItems = function(inout, callback) {
            var currentSlide = getCurrentSlide();
            currentSlide.show();
            var itemCount = $('.item', currentSlide).length;
            var itemFinishedAnimation = 0;
            var callbackCalled = false;
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
                        if (altx) $(toAnimate).animate({ left: altx }, 300, function() {
                            if (!callbackCalled) {
                                callback();
                                callbackCalled = true;
                            }
                        });
                        if (alty) $(toAnimate).animate({ top: alty }, 300, function() {
                            if (!callbackCalled) {
                                callback();
                                callbackCalled = true;
                            }
                        });
                        if (!altx && !alty && !callbackCalled) {
                            callback();
                            callbackCalled = true;
                        }
                    }
                }, delay);
            });
        };

        init(this);

        return this;

    };
}(jQuery));