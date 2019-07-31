// init constants

AJSOF = {

	// add site functions

	hidden: '',
	visibilityChange: '',
	site: {
		Init: (() => {
			var hid = AJSOF.hidden;
			var vis = AJSOF.visibilityChange;
			if (typeof document.hidden !== "undefined") {
				hid = "hidden";
				vis = "visibilitychange";
			} else if (typeof document.msHidden !== "undefined") {
				hid = "msHidden";
				vis = "msvisibilitychange";
			} else if (typeof document.webkitHidden !== "undefined") {
				hid = "webkitHidden";
				vis = "webkitvisibilitychange";
			}
			document.addEventListener(vis, () => {
				if (!document[hid]) {
					location.reload();
				}
			});
			AJSOF.site.chrome = AJSOF.site.chrome();
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
				var site = AJSOF.site;
				site.page.index = num;
				site.hideHeader(false);
				site.menu.close();
				document.getElementById('screen-content').className = `page${num}`;
				document.activeElement.blur();
			})
		},
		safari: !!window.ApplePaySession,
		opera: !!(window.opr && !!window.opr.addons),
		firefox: !!window.InstallTrigger,
		chrome: (() => { return (window.chrome && !AJSOF.site.opera) }),
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
				var cont = AJSOF.site.quickMenu.content;
				var touch = event.touches[0];
				cont.start = true;
				cont.move = document.getElementById('screen-content').offsetLeft - touch.clientX;
				cont.startpos = touch.clientX;
			}),
			move: ((event) => {
				var cont = AJSOF.site.quickMenu.content;
				var contLeft = cont.left;
				var contPos = cont.pos;
				var contHorz = cont.horiz;
				document.getElementById('screen-content').style.transition = 'auto';
				if (cont.start) {
					contPos = event.touches[0].clientX;
				}
				contLeft = contPos + cont.move;
				if (Math.abs(cont.startpos - contPos) > 75) {
					contHorz = true;
				}
				if (contHorz) {
					document.getElementById('screen-content').style.left = (contLeft) + 'px';
				}
			}),
			end: ((event) => {
				document.getElementById('screen-content').style.transition = '';
				var site = AJSOF.site;
				var contLeft = site.quickMenu.content.left;
				var go = site.page.go;
				var wit = window.innerWidth;
				AJSOF.site.quickMenu.content = {
				};
				contLeft = parseInt(document.getElementById('screen-content').style.left);
				if (contLeft > (-0.5 * wit)) {
					go(0);
				}
				if ((-0.5 * wit) > contLeft && contLeft > (-1.5 * wit)) {
					go(1);
				}
				if ((-1.5 * wit) > contLeft) {
					go(2);
				}
				document.getElementById('screen-content').style.left = '';
			})
		},
		hideHeader: ((t_f) => {
			console.log(t_f);
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
		}),
		view: ((focus) => {
			console.log('view');
			document.querySelector('.page-neworder').scrollTop = focus.previousElementSibling.offsetTop - 10;
			AJSOF.site.hideHeader(true);
		})
	},

	// add load functions

	load: {
		Build: (() => {
			return new Promise((resolve, reject) => {
				var site = AJSOF.site;
				AJSOF.load.ServiceWorker();
				document.getElementById('screen-content').addEventListener('touchstart', site.quickMenu.start);
				document.getElementById('screen-content').addEventListener('touchmove', site.quickMenu.move);
				document.getElementById('screen-content').addEventListener('touchend', site.quickMenu.end);
				document.querySelector('.page-neworder').onscroll = () => {
					// if (document.querySelector('.page-neworder').scrollTop > 91 && AJSOF.site.page.index == 0) {
					// 	site.hideHeader(true);
					// }
					// else {
					// if (document.activeElement.tagName == 'BODY') {
					// 	site.hideHeader(false);
					// }
					// }
				};
				resolve();
			});
		}),
		Deny: (() => {
			var nav = navigator.onLine;
			document.getElementById('display-load').children[0].style['-webkit-filter'] = 'blur(10px)';
			document.getElementById('display-install').style.display = 'block';
			if (nav && AJSOF.site.safari) { }
			else if (!nav) {
				console.log(nav);
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