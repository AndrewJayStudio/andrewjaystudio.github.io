// init constants

AJSOF = {

	// add site functions

	hidden: '',
	visibilityChange: '',
	site: {
		Init: (() => {
			if (typeof document.hidden !== "undefined") {
				AJSOF.hidden = "hidden";
				AJSOF.visibilityChange = "visibilitychange";
			} else if (typeof document.msHidden !== "undefined") {
				AJSOF.hidden = "msHidden";
				AJSOF.visibilityChange = "msvisibilitychange";
			} else if (typeof document.webkitHidden !== "undefined") {
				AJSOF.hidden = "webkitHidden";
				AJSOF.visibilityChange = "webkitvisibilitychange";
			}
			document.addEventListener(AJSOF.visibilityChange, () => {
				if (!document[AJSOF.hidden]) {
					location.reload();
				}
			});
			window.onload = () => {
				if (navigator.standalone || true) {
					AJSOF.load.Build().then(() => {
						document.getElementById('display-load').classList.add('load-remove');
					});
				}
				else {
					AJSOF.load.Deny();
				}

				logger(navigator.standalone);
				// canvas = document.getElementById('sign');
				// signaturePad = new SignaturePad(canvas);
			};
		}),
		reload: (() => {
			setTimeout(() => { location.reload() }, 400);
		}),
		page: {
			index: 1,
			go: ((num) => {
				AJSOF.site.page.index = num;
				AJSOF.site.hideHeader(false);
				AJSOF.site.menu.close();
				document.getElementById('screen-content').className = `page${num}`;
				document.activeElement.blur();
			})
		},
		safari: (() => {
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
		}),
		menu: {
			open: (() => {
				document.getElementById('screen-menu').classList.add('menu-open');
			}),
			close: (() => {
				document.getElementById('screen-menu').classList.remove('menu-open');
			})
		},
		quickMenu: {
			content: {},
			start: ((event) => {
				AJSOF.site.quickMenu.content.start = true;
				AJSOF.site.quickMenu.content.move = document.getElementById('screen-content').offsetLeft - event.touches[0].clientX;
				AJSOF.site.quickMenu.content.startpos = event.touches[0].clientX;
			}),
			move: ((event) => {
				document.getElementById('screen-content').style.transition = 'auto';
				if (AJSOF.site.quickMenu.content.start) {
					AJSOF.site.quickMenu.content.pos = event.touches[0].clientX;
				}
				left = AJSOF.site.quickMenu.content.pos + AJSOF.site.quickMenu.content.move;
				if (Math.abs(AJSOF.site.quickMenu.content.startpos - AJSOF.site.quickMenu.content.pos) > 75) {
					AJSOF.site.quickMenu.content.horiz = true;
				}
				if (AJSOF.site.quickMenu.content.horiz) {
					document.getElementById('screen-content').style.left = (left) + 'px';
				}
			}),
			end: ((event) => {
				document.getElementById('screen-content').style.transition = '';
				AJSOF.site.quickMenu.content = {
				};
				left = parseInt(document.getElementById('screen-content').style.left);
				if (left > (-0.5 * window.innerWidth)) {
					AJSOF.site.page.go(0);
				}
				if ((-0.5 * window.innerWidth) > left && left > (-1.5 * window.innerWidth)) {
					AJSOF.site.page.go(1);
				}
				if ((-1.5 * window.innerWidth) > left) {
					AJSOF.site.page.go(2);
				}
				document.getElementById('screen-content').style.left = '';
			})
		},
		hideHeader: ((t_f) => {
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
		})
	},

	// add load functions

	load: {
		Build: (() => {
			return new Promise((resolve, reject) => {
				AJSOF.load.ServiceWorker();
				document.getElementById('screen-content').addEventListener('touchstart', AJSOF.site.quickMenu.start);
				document.getElementById('screen-content').addEventListener('touchmove', AJSOF.site.quickMenu.move);
				document.getElementById('screen-content').addEventListener('touchend', AJSOF.site.quickMenu.end);
				document.querySelector('.page-neworder').onscroll = () => {
					if (document.querySelector('.page-neworder').scrollTop > 91 && AJSOF.site.page.index == 0) {
						AJSOF.site.hideHeader(true);
					}
					else {
						AJSOF.site.hideHeader(false);
					}
				};
				resolve();
			});
		}),
		Deny: (() => {
			document.getElementById('display-load').children[0].style['-webkit-filter'] = 'blur(10px)';
			document.getElementById('display-install').style.display = 'block';
			if (navigator.onLine && AJSOF.site.safari()) { }
			else if (!navigator.onLine) {
				console.log(navigator.onLine);
				document.getElementById('display-install').firstElementChild.innerHTML = 'Please connect to the internet for an up-to-date and stable installation.';
			}
			else {
				document.getElementById('display-install').firstElementChild.innerHTML = 'This App may not be compatible for your device.';
			}
		}),
		ServiceWorker: (() => {
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('/dev/service-worker-AJSOF.js').then((registration) => {
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
		})
	}
}

// init run

AJSOF.site.Init();



// logger 

function logger(log) {
	log = JSON.stringify(log);
	div = document.createElement('div');
	div.innerText = log;
	document.getElementById('dev').appendChild(div);
	document.getElementById('dev').style.display = 'block';
}