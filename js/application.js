/**
 * CasperJS website js code. Steal if you care, enjoy if you dare.
 */
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
        reScroll($(anchor));
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
              , ct = container.position().top
              , ch = container.height()
              , cp = element.css('position')
              , mp = ct + ch - eh
              , em = element.position().left
            ;
            if (sp > ep && sp < mp && cp !== "fixed") {
                element.css('position', 'fixed').css('top', padding).css('left', em).css('margin-top', initial.margintop);
            } else if (cp === "fixed") {
                if (sp < ct + padding) {
                    element.css('position', initial.position).css('margin-top', initial.margintop);
                } else if (sp >= mp) {
                    element.css('position', initial.position).css('margin-top', (ch - eh - padding - 30));
                }
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
        window.onscroll = function() {
            $(initials).each(position);
        };
    })(window);
    // github news
    $('#commits-master').githubInfoWidget({
        user: 'n1k0',
        repo: 'casperjs',
        branch: 'master',
        avatarSize: 40,
        last: 15,
        template: '<tr class="github-commit">' +
            '<td><img class="avatar" /></td>' +
            '<td><a class="user"/></td>' +
            '<td><a class="message" /></td>' +
            '<td><span class="date" /></td>' +
        '</tr>'
    });
});