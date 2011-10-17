$(document).ready(function() {
    // topbar
    $('#topbar').scrollSpy({ padding: 50 });
    function reScroll(target) {
        target = target ? target : $(document.location.hash);
        if (target) {
            scrollTo(document.querySelector('body'), target.position().top - 50);
        }
    }
    $("a[href^=#]").click(function(e) {
        var anchor = $(this).attr('href');
        document.location.href = anchor;
        reScroll($(anchor))
        return e.preventDefault();
    });
    if (document.location.hash) {
        setTimeout(reScroll, 100, $(document.location.hash));
    }
    // hightlighter
    hljs.tabReplace = '    ';
    $('pre code:not(.void)').each(function(i, e) {
        hljs.highlightBlock(e, '    ');
    });
    // apitoc
    (function(window) {
        var containerSelector = 'section';
        var padding = 50;
        var elements = $('.apitoc');
        var initials = [];
        function position(i, initial) {
            var element = initial.element
              , container = initial.container
              , sp = window.scrollY + padding
              , ep = element.position().top
              , eh = element.height()
              , cp = container.position().top
              , ch = container.height()
              , ct = element.css('position')
              , mp = cp + ch - eh
              , em = element.position().left
            ;
            if (sp > ep && sp < mp && ct !== "fixed") {
                element.css('position', 'fixed').css('top', padding).css('left', em);
            } else if (ct === "fixed") {
                if (sp < cp + padding) {
                    element.css('position', initial.position).css('top', initial.top).css('left', initial.left);
                } else if (sp >= mp) {
                    element.css('position', initial.position).css('top', mp - cp);
                }
            } else if (ct === initial.position) {
                element.css('top', initial.top).css('left', initial.left);
            }
        }
        elements.each(function(i, element) {
            var element = $(element);
            initials.push({
                element:   element,
                container: element.parents(containerSelector),
                position:  element.css('position'),
                top:       element.position().top,
                left:      element.position().left
            });
        });
        window.onscroll = function() {
            $(initials).each(position);
        }
    })(window);
});