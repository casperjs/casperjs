/**
 * CasperJS website js code. Steal if you care, enjoy if you dare.
 */
$(document).ready(function() {
    // pretty printing, only when needed
    $('pre').each(function() {
        if ($(this).find('code[class]').length === 1) {
            $(this).addClass('prettyprint');
        }
    });
    prettyPrint();
    // topbar
    $(".collapse").collapse();
    $('#topbar').scrollspy({ offset: 50 });
    $('.dropdown-toggle').dropdown();
    // apitoc
    function checkApiTocLinks() {
        $('.apitoc a[class*="hashactive"]').removeClass('hashactive');
        $('.apitoc a[href="' + window.location.hash + '"]').addClass('hashactive');
    }
    $(window).bind('hashchange', checkApiTocLinks);
    checkApiTocLinks();
    (function(window) {
        var containerSelector = 'section';
        var padding = 50;
        var elements = $('.apitoc');
        var initials = [];
        function wpHeight() {
            return window.innerHeight - padding;
        }
        // sizes
        function size() {
            $('.apitoc').each(function() {
                if ($(this).height() > wpHeight()) {
                    $(this).css('height', (wpHeight() - 15) + 'px')
                        .css('overflow-y', 'scroll')
                        .css('overflow-x', 'hidden');
                }
            });
        }
        function position(i, initial) {
            var element = initial.element
              , container = initial.container
              , sy = window.scrollY
              , ep = element.position().top
              , eh = element.height()
              , cl = container.position().left
              , ct = container.position().top
              , cw = container.width()
              , ch = container.height()
              , cp = element.css('position')
              , mp = ct + ch - eh
              , em = element.position().left
              , ew = element.width()
            ;
            if (window.innerHeight < eh) {
                return;
            }
            if (sy > ep && sy < mp && cp !== "fixed") {
                element.css('position', 'fixed').css('top', padding).css('left', em).css('margin-top', initial.margintop);
            } else if (cp === "fixed") {
                if (sy < ct + padding) {
                    element.css('position', initial.position).css('margin-top', initial.margintop);
                } else if (sy >= mp) {
                    element.css('position', initial.position).css('margin-top', (ch - eh - padding - 30));
                }
                element.css('left', cl + cw - ew - 30);
            }
        }
        elements.each(function(i, element) {
            element = $(element);
            initials.push({
                element:    element,
                container:  element.parents(containerSelector),
                position:   element.css('position'),
                top:        element.position().top,
                left:       element.position().left,
                margintop:  element.css('margin-top')
            });
        });
        size();
        window.onscroll = function() {
            $(initials).each(position);
        };
        window.onresize = function() {
            size();
            $(initials).each(position);
        };
    })(window);
});
