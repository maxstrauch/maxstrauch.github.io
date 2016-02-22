/*
 * (c) 2015 by Maximilian Strauch.
 *
 * Script to display the media view box.
 */

// Variables containing the important elements
var container, img, infoBar, h2, pp, ctrlClose, ctrlNext, ctrlPrev;

// Updates the size of the overlay dynamically on resize events
function updateMediaViewOnResize() { //:void
	var width = window.innerWidth ||
				document.documentElement.clientWidth ||
            	document.body.clientWidth ||
                document.body.offsetWidth;
	var height = window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight ||
                document.body.offsetHeight;

    // Calculate sizes
	var infoHeight = infoBar.scrollHeight || infoBar.clientHeight || infoBar.offsetHeight;
	var imgHeight = height - infoHeight;
	var topOfNextPrev = Math.round((imgHeight/2)-60);

	// Apply sizes
	img.style.width = width + 'px';
	img.style.height = imgHeight + 'px';
	if (ctrlNext)
		ctrlNext.style.top = topOfNextPrev + 'px';
	if (ctrlPrev)
		ctrlPrev.style.top = topOfNextPrev + 'px';
}

// Creates all needed components
function initMediaView() {
	container = document.createElement('div');
	img = document.createElement('div');
	infoBar = document.createElement('div');
	h2 = document.createElement('h2');
	pp = document.createElement('p');
	ctrlClose = document.createElement('div');
	ctrlNext = document.createElement('div');
	ctrlPrev = document.createElement('div');

	// Overlay container
	container.id = 'mv-container';
	document.getElementsByTagName('body')[0].appendChild(container);

	// Image container
	img.id = 'mv-image';
	img.className = 'ignore';
	container.appendChild(img);

	// Information container
	infoBar.id = 'mv-info-wrapper';
	container.appendChild(infoBar);
	infoBar.appendChild(h2);
	infoBar.appendChild(pp);

	// Controls
	ctrlClose.className = 'ctrl ctrl-close';
	ctrlClose.title = 'Escape media viewer (ESC)'
	ctrlClose.onclick = function() {
		container.style.display = 'none';
		img.style.backgroundImage = 'none';
		h2.innerHTML = '';
		pp.innerHTML = '';
		ctrlNext.style.display = 'none';
		ctrlPrev.style.display = 'none';
	};
	container.appendChild(ctrlClose);

	ctrlNext.className = 'ctrl ctrl-right';
	ctrlNext.style.display = 'none';
	ctrlNext.title = 'Show next image (ARROW RIGHT)';
	container.appendChild(ctrlNext);

	ctrlPrev.className = 'ctrl ctrl-left';
	ctrlPrev.style.display = 'none';
	ctrlPrev.title = 'Show previous image (ARROW LEFT)';
	container.appendChild(ctrlPrev);
	
	// Register resize trigger
	window.onresize = updateMediaViewOnResize;

	// Attach media viewer to every image element
	var last = undefined;
	var es = document.getElementsByTagName("img");
	for (var i = 0; i < es.length; i++) {
		// If element has class 'ignore', ignore this image 
		if (es[i].className.toLowerCase().indexOf('ignore') != -1) {
			continue;
		}
		
		// Set properties
		es[i].style.cursor = 'pointer';
		es[i].id = 'img-' + i;
		es[i].onclick = function() {
			// Handle key events
			window.onkeyup = function(e) {
				if (e.keyCode == 27) {
					ctrlClose.onclick();
				} else if (e.keyCode == 37) {
					if (ctrlPrev.onclick) {
						ctrlPrev.onclick();
					}
				} else if (e.keyCode == 39) {
					if (ctrlNext.onclick) {
						ctrlNext.onclick();
					}
				}
			};

			// Apply data on show
			img.style.backgroundImage = 'url("' + this.src + '")';
			h2.innerHTML = this.title;
			pp.innerHTML = 'Image ' + this.getAttribute('data-i') 
							+ ' of ' + this.getAttribute('data-length') + '. '
							+ 'Posted in &quot;' 
							+ document.getElementsByClassName('post-title')[0].innerHTML 
							+ '&quot;. '
							+ document.getElementsByClassName('post-meta')[0].innerHTML;

			// Register navigation buttons
			var those = this;
			if (this.getAttribute('data-next')) {
				ctrlNext.style.display = 'block';
				ctrlNext.onclick = function() {
					document.getElementById(those.getAttribute('data-next')).onclick();
				};
			} else {
				ctrlNext.style.display = 'none';
				ctrlNext.onclick = undefined;
			}

			if (this.getAttribute('data-prev')) {
				ctrlPrev.style.display = 'block';
				ctrlPrev.onclick = function() {
					document.getElementById(those.getAttribute('data-prev')).onclick();
				};
			} else {
				ctrlPrev.style.display = 'none';
				ctrlPrev.onclick = undefined;
			}
				
			// Update the dimensions and show it!
			container.style.display = 'block';
			updateMediaViewOnResize();
		};

		// Attach id of previous image
		if (last != undefined) {
			es[i].setAttribute('data-prev', last.id)
		}
		last = es[i];

		// Apply image numbering
		es[i].setAttribute('data-i', i + 1)
		es[i].setAttribute('data-length', es.length)
	}

	// Apply next image links to image chain
	while (last) {
		var id = last.id;
		last = document.getElementById(last.getAttribute('data-prev'));
		if (last) {
			last.setAttribute('data-next', id);
		}
	}
}

// Perform init on onload
var old = window.onload;
window.onload = function() {
	initMediaView();
	if (old) {
		old();
	}
};