/**
 * CasperJS website js code. Steal if you care, enjoy if you dare.
 */
$(document).ready(function() {
    // pretty printing
    prettyPrint();
    // topbar
    $(".collapse").collapse();
    $('#topbar').scrollspy({ offset: 50 });
    $('.dropdown-toggle').dropdown();
    // apitoc
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
                    $(this).css('height', wpHeight() + 'px').css('overflow', 'auto');
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
    // github news
    $('#commits-master').githubInfoWidget({
        user: 'n1k0',
        repo: 'casperjs',
        branch: 'master',
        avatarSize: 40,
        last: 15,
        template: '<tr class="github-commit">' +
            //'<td><img class="avatar" /></td>' +
            '<td><a class="user"/></td>' +
            '<td><a class="message" /></td>' +
            '<td><span class="date" /></td>' +
        '</tr>'
    });
});