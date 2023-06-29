/*!
  * Speedbump v1.0.2
*/

$.fn.speedBumpModal = function (options) {

    // Pass array through settings
    var settings = $.extend({
        'speedBumpTitle': 'You are leaving this website',
        'speedBumpSummary': 'You are leaving our website and entering a third party website over which we have no control. We do not endorse or guarantee and are not responsible for the content, links, privacy, or security of the website, or the products, services, information, or recommendations offered on this website.',
        'speedBumpContinueLink': 'Continue',
        'speedBumpContinueLinkClass': '',
        'speedBumpCancelLink': 'Cancel',
        'speedBumpCancelClass': '',
        'speedBumpIgnoreArray': [],
        'speedBumpHeadingTag': '<h4>',
        'speedBumpCloseButtonClass': '',
        'speedBumpCloseIconClass': ''
    }, options);

    var continueClass = (settings.speedBumpContinueLinkClass !== '') ? settings.speedBumpContinueLinkClass : '';
    var cancelClass = (settings.speedBumpCancelClass !== '') ? settings.speedBumpCancelClass : '';
    var closeClass = (settings.speedBumpCloseButtonClass !== '') ? settings.speedBumpCloseButtonClass : '';

    // Build outer speedbump modal div
    $(document.createElement('div'))
        .addClass('speed-bump')
        .attr({
            'tabindex': '-1',
            'role': 'dialog',
            'aria-modal': true,
            'aria-labelledby': 'speedBumpTitle'
        })
        .appendTo('body');

    // Build outer speed-bump dialog
    $(document.createElement('div'))
        .addClass('speed-bump__dialog')
        .attr('role', 'document')
        .appendTo('.speed-bump');

    // Build speed-bump content
    $(document.createElement('div'))
        .addClass('speed-bump__content')
        .appendTo('.speed-bump__dialog');

    // Build speed-bump title
    $(settings.speedBumpHeadingTag)
        .addClass('speed-bump__title')
        .attr('id', 'speedBumpTitle')
        .html(settings.speedBumpTitle)
        .appendTo('.speed-bump__content');

    // Build speed-bump summary
    $(document.createElement('p'))
        .addClass('speed-bump__summary')
        .html(settings.speedBumpSummary)
        .appendTo('.speed-bump__content');

    // Build speed-bump continue link
    $(document.createElement('a'))
        .addClass('speed-bump__continue')
        .addClass(continueClass)
        .attr('href', 'null')
        .html(settings.speedBumpContinueLink)
        .appendTo('.speed-bump__content');

    // Build speed-bump cancel link
    $(document.createElement('button'))
        .addClass('speed-bump__cancel')
        .addClass(cancelClass)
        .attr('type', 'button')
        .html(settings.speedBumpCancelLink)
        .appendTo('.speed-bump__content');

    // Build speed-bump close button
    $(document.createElement('button'))
        .addClass('speed-bump__close')
        .addClass(closeClass)
        .attr('type', 'button')
        .attr('aria-label', 'Close')
        .attr({
            'type': 'button',
            'aria-label': 'Close'
        })
        .insertAfter('.speed-bump__title');

    // Build speed-bump cancel button icon
    if (settings.speedBumpCloseIconClass !== '') {
        $(document.createElement('span'))
            .addClass(settings.speedBumpCloseIconClass)
            .attr('aria-hidden', 'true')
            .appendTo('.speed-bump__close');
    }

    // Trap the keyboard to the off canvas elements when speedbump modal is showing
    var focusBeforeSpeedbump;
    var trapKeyboardToSpeedbump = function () {

        // Cache anchor that fired speedbump
        focusBeforeSpeedbump = $(':focus');

        var firstTabbable = $('.speed-bump__close');
        var lastTabbable = $('.speed-bump__cancel');

        // Set focus on first input
        firstTabbable.focus();

        // Redirect last tab to first input
        lastTabbable.on('keydown', function (e) {
            if (e.which === 9 && !e.shiftKey) {
                e.preventDefault();
                firstTabbable.focus();
            }
        });

        // Redirect first shift+tab to last input
        firstTabbable.on('keydown', function (e) {
            if (e.which === 9 && e.shiftKey) {
                e.preventDefault();
                lastTabbable.focus();
            }
        });

        // Focus on the off canvas element
        $('.speed-bump__content').focus();
    };

    // Close speed-bump function
    function speedBumpHide() {
        $('body').removeClass('js-speedbump-showing');
        $('[data-anchor-active]')
            .focus()
            .removeAttr('data-anchor-active');
        $('.speed-bump__continue').attr('target', '');
        focusBeforeSpeedbump.focus();
    }

    // Setup array of domains to ignore
    var flaggedArr = settings.speedBumpIgnoreArray;
    var localUrl = location.host;
    flaggedArr.push(localUrl);

    var cleanArray = $.map(flaggedArr, function (n, i){
        var arrayItem = n.split(' ').join('');
        
        if (arrayItem === '') {
            return;
        } else {
            return arrayItem.toLowerCase();
        }
    });

    function absolutePath(href) {
        var link = document.createElement('a');
        link.href = href;
        return (link.protocol + '//' + link.host + link.pathname + link.search + link.hash);
    }

    // Set class on internal and ignored links
    $('a[href]').each(function () {
        var $this = $(this),
            anchorHref = absolutePath($this.attr('href').toLowerCase());

        for (var i = cleanArray.length - 1; i >= 0; --i) {
            if (anchorHref.indexOf(cleanArray[i]) !== -1) {
                $this.addClass('js-no-speed-bump');
            }
        }
    });

    var selectorString = 
        'a:not(.js-no-speed-bump)' +
        ':not([href^="#"])' +
        ':not([href^="/"])' +
        ':not(.speed-bump__continue)' +
        ':not([href=""])'
    ;

    // Anchor click modal functionality
    $(selectorString).on('click', function (e){
        
        $('body').addClass('js-speedbump-showing');

        e.preventDefault();
        e.stopPropagation();

        var $this = $(this);
        var $thisUrl = $this.attr('href');
        var newWindow = ($this.attr('target') === '_blank') ? true : false;

        // Add data attribute to currently active anchor
        $this.attr('data-anchor-active', 'true');

        // Display and focus on the speed-bump modal
        $('.speed-bump')
            .focus();

        // Speedbump continue link
        $('.speed-bump__continue').attr('href', $thisUrl);

        if (newWindow === true) {
            $('.speed-bump__continue').attr('target', '_blank');
        }

        trapKeyboardToSpeedbump();
    });

    // Speedbump cancel button click
    $('.speed-bump__close, .speed-bump__cancel').on('click', function (e) {
        speedBumpHide();
    });

    // Close speed bump after clicking continue
    $('.speed-bump__continue').on('click', function () {
        setTimeout(function (){
            speedBumpHide();
        }, 300);
    });

    // Click off speed-bump closes it
    $('.speed-bump').on('click', function (e) {
        if (!$(e.target).closest('.speed-bump__content').length) {
            speedBumpHide();
        }
    }).on('keydown', function (e) {
        if (e.keyCode === 27) {
            speedBumpHide();
        }
    });
};
