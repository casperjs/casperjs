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
    var containerSelector = 'section';
    var padding = 50;
    window.onscroll = function(event) {
        $('.apitoc').each(function(i, element) {
            var element = $(element)
              , container = element.parents(containerSelector)
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
                    element.css('position', 'inherit').css('top', 'inherit');
                } else if (sp > mp) {
                    element.css('position', 'relative').css('top', mp - cp - padding);
                }
            } else if (ct === "relative") {
                element.css('position', 'inherit').css('top', 'inherit');
            }
        });
    }
});