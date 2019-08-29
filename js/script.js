'use strict';

let footerEmail   = document.querySelector('.footer__form-input'),
		linkLogin     = document.querySelectorAll('.link-login'),
		popupBody     = document.querySelector('body'),
		popupWrapper  = document.querySelector('.modal-wrapper'),
		popupLogin    = document.querySelector('.modal--login'),
		linkRecovery  = popupLogin.querySelector('.link-recovery'),
		popupRecovery = document.querySelector('.modal--recovery');

popupBody.classList.remove('no-js');

function checkFooterForm() {
	document.querySelector('.footer__form-button').disabled = footerEmail.value ? false : "disabled";
}

for (let i = 0; i < linkLogin.length; i++) {
	let link = linkLogin[i];
	link.addEventListener('click', function (event) {
		event.preventDefault();
		if (popupRecovery.classList.contains('modal--show')) {
				popupRecovery.classList.remove('modal--show');
				popupWrapper.classList.remove('modal--show');
		}
		if (popupBody.classList.contains('modal--open')) {
				popupBody.classList.remove('modal--open');
		}
	popupBody.classList.add('modal--open');
	popupWrapper.classList.add('modal--show');
	popupLogin.classList.add('modal--show');
	});
}

linkRecovery.addEventListener('click', function(event) {
	event.preventDefault();
	if (popupLogin.classList.contains('modal--show')) {
			popupLogin.classList.remove('modal--show');
			popupWrapper.classList.remove('modal--show');
	}
	popupWrapper.classList.add('modal--show');
	popupRecovery.classList.add('modal--show');
});

popupWrapper.addEventListener("click", function() {
	if (popupLogin.classList.contains('modal--show')) {
			popupWrapper.classList.remove('modal--show');
			popupLogin.classList.remove('modal--show');
			popupBody.classList.remove('modal--open');
	}
	if (popupRecovery.classList.contains('modal--show')) {
			popupWrapper.classList.remove('modal--show');
			popupRecovery.classList.remove('modal--show');
			popupBody.classList.remove('modal--open');
	}
});

window.addEventListener("keydown", function(event) {
	if (event.keyCode === 27) {
		if (popupLogin.classList.contains('modal--show')) {
			popupWrapper.classList.remove('modal--show');
			popupLogin.classList.remove('modal--show');
			popupBody.classList.remove('modal--open');
		}
		if (popupRecovery.classList.contains('modal--show')) {
			popupWrapper.classList.remove('modal--show');
			popupRecovery.classList.remove('modal--show');
			popupBody.classList.remove('modal--open');
		}
	}
});