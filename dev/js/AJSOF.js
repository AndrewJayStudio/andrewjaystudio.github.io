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
						AJSOF.form.sign.start();
					});
				}
				else {
					AJSOF.load.Deny();
				}

				logger(navigator.standalone);
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
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			if (focus === 'blur') {
				if (document.activeElement.tagName == 'BODY') {
					AJSOF.site.hideHeader(false);
				}
			}
			else {
				// document.querySelector('.page-neworder').scrollTop = focus.previousElementSibling.offsetTop - 10;
				AJSOF.site.hideHeader(true);
			}
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
	},
	form: {
		descript: ((elm) => {
			elm.style.height = elm.scrollHeight + 2 + 'px';
			logger(elm.style.height);
			logger(elm.scrollHeight);
		}),
		material: ((mat) => {
			try {
				var materials = document.querySelectorAll('.form-table div').length;
				var pos = mat.parentNode.nextElementSibling;
				if (mat.value != '' && pos === null) {
					var div = document.createElement('div');
					var txtIn = document.querySelector('.form-table input[type=text]').cloneNode(true);
					var numIn = document.querySelector('.form-table input[type=number]').cloneNode(true);
					txtIn.value = '';
					numIn.value = '';
					txtIn.setAttribute('name', `materials-${materials}`);
					numIn.setAttribute('name', `quantity-${materials}`);
					div.appendChild(txtIn);
					div.appendChild(numIn);
					document.querySelector('.form-table').appendChild(div);
				}
				else if (mat.value == '' && pos.firstElementChild.value == '') {
					if (pos.firstElementChild.nextElementSibling.value == '') {
						pos.remove();
					}
				}
				else if (mat.value == '' && pos.firstElementChild.value != '') {
					if (mat.nextElementSibling.value == '') {
						mat.parentElement.remove();
					}
				}
			}
			catch (e) { }
		}),
		sign: {
			pad: undefined,
			start: (() => {
				var canvas = document.getElementById('sign');
				var padH = Math.max(window.innerHeight, window.innerWidth);
				var pad = new SignaturePad(canvas, {
					throttle: 20,
					minDistance: 0,
					penColor: '#303335',
					onEnd: (() => {
						AJSOF.form.sign.stored.undo = AJSOF.form.sign.pad.toData();
					})
				});
				canvas.width = padH;
				canvas.height = padH;
				AJSOF.form.sign.pad = pad;
			}),
			stored: {
				current: undefined,
				undo: '',
				redo: '',
				w: undefined,
				h: undefined
			}
		}
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

logger('v2');


// var signaturePad;
// var canvas = document.getElementById('sign');
// if (AJSOF.form.sign.pad) {
// 	signaturePad = AJSOF.form.sign.pad;
// 	AJSOF.form.sign.stored.current = signaturePad.toData();
// 	signaturePad.off();
// }
// signaturePad = new SignaturePad(canvas);
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// AJSOF.form.sign.pad = signaturePad;
// var data = AJSOF.form.sign.stored.current;
// if (data) {
// 	data[0].forEach((point, index) => {
// 		var x = point.x;
// 		var y = point.y;
// 		if (screen.orientation.type.indexOf('landscape') + 1) {
// 			data[0][index].x = y;
// 			data[0][index].y = window.innerHeight - x;
// 		}
// 		else {
// 			data[0][index].x = window.innerWidth - y;
// 			data[0][index].y = x;
// 		}
// 	});
// 	signaturePad.fromData(data);
// }