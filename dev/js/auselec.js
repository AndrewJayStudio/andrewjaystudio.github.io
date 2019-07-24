// init constants

auselec = {
	'hidden': '',
	'page': 1,
	'visibilityChange': '',
	'site': {},
	'load': {}
}

// add site functions

auselec.site.Init = (() => {
	if (typeof document.hidden !== "undefined") {
		auselec.hidden = "hidden";
		auselec.visibilityChange = "visibilitychange";
	} else if (typeof document.msHidden !== "undefined") {
		auselec.hidden = "msHidden";
		auselec.visibilityChange = "msvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") {
		auselec.hidden = "webkitHidden";
		auselec.visibilityChange = "webkitvisibilitychange";
	}
	document.addEventListener(auselec.visibilityChange, () => {
		if (!document[auselec.hidden]) {
			location.reload();
		}
	});
});

auselec.site.hideHeader = ((t_f) => {
	if (t_f) {
		document.querySelector('.screen-header').style.top = '-91px';
		document.querySelector('.screen-box').style['padding-top'] = '0px';
		document.getElementById('screen-content').style['max-height'] = '100vh';
	}
	else {
		document.querySelector('.screen-header').style.top = '';
		document.querySelector('.screen-box').style['padding-top'] = '';
		document.getElementById('screen-content').style['max-height'] = '';
	}
});

// add load functions

auselec.load.Build = (() => {
	return new Promise((resolve, reject) => {
		auselec.load.ServiceWorker();
		document.getElementById('screen-content').addEventListener('touchstart', quickMenuStart);
		document.getElementById('screen-content').addEventListener('touchmove', quickMenuMove);
		document.getElementById('screen-content').addEventListener('touchend', quickMenuEnd);
		document.querySelector('.page-neworder').onscroll = () => {
			if (document.querySelector('.page-neworder').scrollTop > 91 && auselec.page == 0) {
				auselec.site.hideHeader(true);
			}
			else {
				auselec.site.hideHeader(false);
			}
		};
		resolve();
	});
});

auselec.load.Deny = (() => {
	document.getElementById('display-load').children[0].style['-webkit-filter'] = 'blur(10px)';
	document.getElementById('display-install').style.display = 'block';
	if (navigator.onLine && isIosSafari()) { }
	else if (!navigator.onLine) {
		console.log(navigator.onLine);
		document.getElementById('display-install').firstElementChild.innerHTML = 'Please connect to the internet for an up-to-date and stable installation.';
	}
	else {
		document.getElementById('display-install').firstElementChild.innerHTML = 'This App may not be compatible for your device.';
	}
});

auselec.load.ServiceWorker = (() => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/dev/auselec-sw.js').then((registration) => {
			// Registration was successful
			logger('SW Worked');
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, (err) => {
			// registration failed :(
			logger('SW err');
			console.log('ServiceWorker registration failed: ', err);
		});
	}
	else {
		logger('No SW');
	}
});

// init run

auselec.site.Init();

var contentTouch = {
};

// load run

window.onload = () => {
	if (navigator.standalone || true) {
		auselec.load.Build().then(() => {
			document.getElementById('display-load').classList.add('load-remove');
		});
	}
	else {
		auselec.load.Deny();
	}

	logger(navigator.standalone);
	// canvas = document.getElementById('sign');
	// signaturePad = new SignaturePad(canvas);
}













function isIosSafari() {
	nav = window.navigator;
	logger(nav.userAgent);
	yes = false;
	['iPhone', 'iPad', 'iPod'].forEach((device) => {
		isTrue = ('standalone' in nav
			&& nav.userAgent.indexOf(device) != -1
			&& nav.userAgent.indexOf('Mac OS') != -1
			&& nav.userAgent.indexOf('Safari') != -1
			&& nav.userAgent.indexOf('CriOS') == -1);
		if (isTrue) {
			yes = true;
		}
	});
	logger(yes);
	return yes;
}

function RegisterSW() {

}

function toReload() {
	setTimeout(() => { location.reload() }, 400);
}

function openMenu() {
	document.getElementById('screen-menu').classList.add('menu-open');
}

function closeMenu() {
	document.getElementById('screen-menu').classList.remove('menu-open');
}

function goToPage(num) {
	auselec.page = num;
	auselec.site.hideHeader(false);
	closeMenu();
	document.getElementById('screen-content').className = `page${num}`;
	document.activeElement.blur();
}

function quickMenuStart(event) {
	contentTouch.start = true;
	contentTouch.move = document.getElementById('screen-content').offsetLeft - event.touches[0].clientX;
	contentTouch.startpos = event.touches[0].clientX;
}

function quickMenuMove(event) {
	document.getElementById('screen-content').style.transition = 'auto';
	if (contentTouch.start) {
		contentTouch.pos = event.touches[0].clientX;
	}
	left = contentTouch.pos + contentTouch.move;
	if (Math.abs(contentTouch.startpos - contentTouch.pos) > 75) {
		contentTouch.horiz = true;
	}
	if (contentTouch.horiz) {
		document.getElementById('screen-content').style.left = (left) + 'px';
	}
}

function quickMenuEnd(event) {
	document.getElementById('screen-content').style.transition = '';
	contentTouch = {
	};
	left = parseInt(document.getElementById('screen-content').style.left);
	if (left > (-0.5 * window.innerWidth)) {
		goToPage(0);
	}
	if ((-0.5 * window.innerWidth) > left && left > (-1.5 * window.innerWidth)) {
		goToPage(1);
	}
	if ((-1.5 * window.innerWidth) > left) {
		goToPage(2);
	}
	document.getElementById('screen-content').style.left = '';
}


function getFile() {
	try {
		logger('ran');
		data = document.getElementById('data');
		logger(data.value);
		data = data.value.split('');
		logger(data);
		data = data.map((letter) => {
			return letter.charCodeAt(0);
		});
		logger(data);
		data = data.join(' ');
		logger(data);
		a = window.btoa(data);
		logger(a);
		document.body.innerHTML = '';
		document.body.innerText = 'AustinElectric/' + a;
	}
	catch (err) {
		logger(err);
	}
}

function submitForm(event) {
	event.preventDefault();
	event.target.childNodes.forEach((cur) => {
		try {
			if (!form_data) {
				form_data = {};
			}
		}
		catch (e) {
			form_data = {};
		}
		if (cur.name) {
			form_data[cur.name] = cur.value;
		}
	});
	console.log(form_data);
}

function logger(log) {
	log = JSON.stringify(log);
	div = document.createElement('div');
	div.innerText = log;
	document.getElementById('dev').appendChild(div);
	document.getElementById('dev').style.display = 'block';
}