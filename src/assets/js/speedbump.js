/*!
  * Speed bump v2.0.0 Beta
*/

const speedBumpModal = function(options) {
	const settings = Object.assign({
		speedBumpTitle: 'You are leaving this website',
		speedBumpSummary: 'You are leaving our website and entering a third party website over which we have no control. We do not endorse or guarantee and are not responsible for the content, links, privacy, or security of the website, or the products, services, information, or recommendations offered on this website.',
		speedBumpContinueLink: 'Continue',
		speedBumpContinueLinkClass: '',
		speedBumpCancelLink: 'Cancel',
		speedBumpCancelClass: '',
		speedBumpIgnoreArray: [],
		speedBumpHeadingTag: '<h4>',
		speedBumpCloseButtonClass: '',
		speedBumpCloseIconClass: '',
	}, options);

	const continueClass = settings.speedBumpContinueLinkClass !== '' ? settings.speedBumpContinueLinkClass : '';
	const cancelClass = settings.speedBumpCancelClass !== '' ? settings.speedBumpCancelClass : '';
	const closeClass = settings.speedBumpCloseButtonClass !== '' ? settings.speedBumpCloseButtonClass : '';
	
    // Build outer speed-bump modal div
	const speedBumpModal = document.createElement('div');
	speedBumpModal.classList.add('speed-bump');
	speedBumpModal.tabIndex = '-1';
	speedBumpModal.role = 'dialog';
	speedBumpModal.setAttribute('aria-modal', true);
	speedBumpModal.setAttribute('aria-labelledby', 'speedBumpTitle');
	document.body.appendChild(speedBumpModal);
	
    // Build outer speed-bump dialog
	const speedBumpDialog = document.createElement('div');
	speedBumpDialog.classList.add('speed-bump__dialog');
	speedBumpDialog.setAttribute('role', 'document');
	speedBumpModal.appendChild(speedBumpDialog);
	
    // Build speed-bump content
	const speedBumpContent = document.createElement('div');
	speedBumpContent.classList.add('speed-bump__content');
	speedBumpDialog.appendChild(speedBumpContent);
	
    // Build speed-bump title
    const speedBumpHeadingTagString = settings.speedBumpHeadingTag.replace('<', '').replace('>', '');
	const speedBumpTitle = document.createElement(speedBumpHeadingTagString);
	speedBumpTitle.classList.add('speed-bump__title');
	speedBumpTitle.id = 'speedBumpTitle';
	speedBumpTitle.innerHTML = settings.speedBumpTitle;
	speedBumpContent.appendChild(speedBumpTitle);
	
    // Build speed-bump summary
	const speedBumpSummary = document.createElement('p');
	speedBumpSummary.classList.add('speed-bump__summary');
	speedBumpSummary.innerHTML = settings.speedBumpSummary;
	speedBumpContent.appendChild(speedBumpSummary);
	
    // Build speed-bump continue link
	const speedBumpContinueLink = document.createElement('a');
	speedBumpContinueLink.classList.add('speed-bump__continue');
    classesToArray(continueClass).forEach(item => {
        speedBumpContinueLink.classList.add(item);
    });
	speedBumpContinueLink.href = 'null';
	speedBumpContinueLink.innerHTML = settings.speedBumpContinueLink;
	speedBumpContent.appendChild(speedBumpContinueLink);
	
    // Build speed-bump cancel link
	const speedBumpCancelLink = document.createElement('button');
	speedBumpCancelLink.classList.add('speed-bump__cancel');
    classesToArray(cancelClass).forEach(item => {
        speedBumpCancelLink.classList.add(item);
    });
    speedBumpCancelLink.type = 'button';
	speedBumpCancelLink.innerHTML = settings.speedBumpCancelLink;
	speedBumpContent.appendChild(speedBumpCancelLink);
	
    // Build speed-bump close button
	const speedBumpCloseButton = document.createElement('button');
	speedBumpCloseButton.classList.add('speed-bump__close');
    classesToArray(closeClass).forEach(item => {
        speedBumpCloseButton.classList.add(item);
    });
	speedBumpCloseButton.setAttribute('type', 'button');
	speedBumpCloseButton.setAttribute('aria-label', 'Close');
	speedBumpCloseButton.setAttribute('type', 'button');
    speedBumpContent.insertBefore(speedBumpCloseButton, speedBumpTitle.nextSibling);
	
    // Build speed-bump cancel button icon
	if (settings.speedBumpCloseIconClass !== '') {
		const speedBumpCloseIcon = document.createElement('span');
		speedBumpCloseIcon.className = settings.speedBumpCloseIconClass;
		speedBumpCloseIcon.setAttribute('aria-hidden', 'true');
		speedBumpCloseButton.appendChild(speedBumpCloseIcon);
	}
	
    // Trap the keyboard to the off canvas elements when speed bump modal is showing
	let focusBeforeSpeedbump;
	const trapKeyboardToSpeedbump = () => {
		focusBeforeSpeedbump = document.activeElement;
		
        const firstTabbable = document.querySelector('.speed-bump__close');
		const lastTabbable = document.querySelector('.speed-bump__cancel');
		firstTabbable.focus();
		
        lastTabbable.addEventListener('keydown', (e) => {
			if (e.which === 9 && !e.shiftKey) {
				e.preventDefault();
				firstTabbable.focus();
			}
		});

		firstTabbable.addEventListener('keydown', (e) => {
			if (e.which === 9 && e.shiftKey) {
				e.preventDefault();
				lastTabbable.focus();
			}
		});

		document.querySelector('.speed-bump__content').focus();
	};

    // Hide modal
	function speedBumpHide() {
		document.body.classList.remove('js-speedbump-showing');
		const anchor = document.querySelector('[data-anchor-active]');
		if (anchor) {
			anchor.focus();
			anchor.removeAttribute('data-anchor-active');
		}
		document.querySelector('.speed-bump__continue').setAttribute('target', '');
		focusBeforeSpeedbump.focus();
	}

    // Convert class(es) string to array
    function classesToArray(string) {
        return string.toString().split(' ').join(',').split(',');
    }

	const flaggedArr = settings.speedBumpIgnoreArray;
	const localUrl = location.host;
	flaggedArr.push(localUrl);
	const cleanArray = flaggedArr.map((n) => n.split(' ').join('')).filter((arrayItem) => arrayItem !== '').map((arrayItem) => arrayItem.toLowerCase());

	function absolutePath(href) {
		const link = document.createElement('a');
		link.href = href;
		return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
	}

	document.querySelectorAll('a[href]').forEach((link) => {
		const anchorHref = absolutePath(link.getAttribute('href').toLowerCase());
		for (let i = cleanArray.length - 1; i >= 0; --i) {
			if (anchorHref.indexOf(cleanArray[i]) !== -1) {
				link.classList.add('js-no-speed-bump');
			}
		}
	});

	const externalLinkSelectorString =
        'a:not(.js-no-speed-bump)' +
        ':not([href^="#"])' +
        ':not([href^="/"])' +
        ':not(.speed-bump__continue)' +
        ':not([href=""])'
    ;
	
    document.querySelectorAll(externalLinkSelectorString).forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			
            document.body.classList.add('js-speedbump-showing');
			
            const currentUrl = link.getAttribute('href');
			const newWindow = link.getAttribute('target') === '_blank';
			
            link.setAttribute('data-anchor-active', 'true');
			
            speedBumpModal.focus();
			
            document.querySelector('.speed-bump__continue').setAttribute('href', currentUrl);
			
            if (newWindow) {
				document.querySelector('.speed-bump__continue').setAttribute('target', '_blank');
			}

			trapKeyboardToSpeedbump();
		});
	});

	const cancelButtons = document.querySelectorAll('.speed-bump__cancel, .speed-bump__close');
    cancelButtons.forEach((button) => {
		button.addEventListener('click', speedBumpHide);
	});

	const continueButton = document.querySelector('.speed-bump__continue');
	continueButton.addEventListener('click', () => {
		setTimeout(speedBumpHide, 300);
	});
	
    const speedBumpModalEl = document.querySelector('.speed-bump');
	speedBumpModalEl.addEventListener('click', (e) => {
		if (!e.target.closest('.speed-bump__content')) {
			speedBumpHide();
		}
	});
    
	speedBumpModalEl.addEventListener('keydown', (e) => {
		if (e.keyCode === 27) {
			speedBumpHide();
		}
	});
};