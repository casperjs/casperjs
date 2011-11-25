(function ($) {
	function widget(element, options, callback) {
		this.element = element;
		this.options = options;
		this.callback = $.isFunction(callback) ? callback : $.noop;
	}

	widget.prototype = (function() {

		function _widgetRun(widget) {
			if (!widget.options) {
				widget.element.append('<span class="error">Options for widget are not set.</span>');
				return;
			}
			var defaultTemplate = '<li class="github-commit"><p>' +
	            '<img class="avatar" />' +
	            '<a class="user"/>' +
	            '<a class="message" />' +
	            '<span class="date" />' +
	        '</p></li>';
			var callback = widget.callback;
			var element = widget.element;
			var user = widget.options.user;
			var repo = widget.options.repo;
			var branch = widget.options.branch;
			var avatarSize = widget.options.avatarSize || 20;
			var template = widget.options.template || defaultTemplate;
			var last = widget.options.last == undefined ? 0 : widget.options.last;
			var limitMessage = widget.options.limitMessageTo == undefined ? 0 : widget.options.limitMessageTo;

			element.append('<h3>Widget intitalization, please wait...</h3>');
			gh.commit.forBranch(user, repo, branch, function (data) {
				var commits = last ? data.commits.slice(0, last) : data.commits;
				var totalCommits = (last < commits.length ? last : commits.length);

				element.empty();
				var list = $('<ul>').appendTo(element);

				commits.forEach(function(commit) {
					var tpl = $(template);
					tpl.find('.avatar')
						.attr('src', 'http://www.gravatar.com/avatar/' + hex_md5(commit.author.email) + '?s=' + avatarSize);
					tpl.find('.user').attr('href', 'https://github.com/' + commit.author.login)
						.html(commit.author.login);
					tpl.find('.message').attr('href', 'https://github.com' + commit.url)
						.html(commit.message);
					tpl.find('.date').html(when(commit.committed_date));
					list.append(tpl);
				});

				callback(element);

				function avatar(email, size) {
					var emailHash = hex_md5(email);
					return '<img class="github-avatar" src="http://www.gravatar.com/avatar/' + emailHash + '?s=' + size + '"/>';
				}

				function author(login) {
					return '<a class="github-user" href="https://github.com/' + login + '">' + login + '</a>';
				}

				function message(commitMessage, url) {
					if (limitMessage > 0 && commitMessage.length > limitMessage) {
						commitMessage = commitMessage.substr(0, limitMessage) + '...';
					}
					return '"' + '<a class="github-commit" href="https://github.com' + url + '">' + commitMessage + '</a>"';
				}

				function when(commitDate) {
					var commitTime = new Date(commitDate).getTime();
					var todayTime = new Date().getTime();
					var differenceInDays = Math.floor(((todayTime - commitTime)/(24*3600*1000)));
					if (differenceInDays == 0) {
						var differenceInHours = Math.floor(((todayTime - commitTime)/(3600*1000)));
						if (differenceInHours == 0) {
							var differenceInMinutes = Math.floor(((todayTime - commitTime)/(600*1000)));
							if (differenceInMinutes == 0) {
								return 'just now';
							}
							return 'about ' + differenceInMinutes + ' minutes ago';
						}
						return 'about ' + differenceInHours + ' hours ago';
					}
					return differenceInDays + ' days ago';
				}
			});
		}

		return {
			run: function () {
				_widgetRun(this);
			}
		};

	})();

	$.fn.githubInfoWidget = function(options, callback) {
		var w = new widget(this, options, callback);
		w.run();

		return this;
	}

})(jQuery);