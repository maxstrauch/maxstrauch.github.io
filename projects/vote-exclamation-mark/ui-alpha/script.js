var $ = function(id) { 
			return {
				e: document.getElementById(id),
				toggleClass: function(name) {
					var clazz = this.e.className, newClazz = "";
					if (clazz.indexOf(name) < 0) {
						newClazz = clazz + " " + name;
					} else {
						var newClazz = clazz.substr(0, clazz.indexOf(name) - 1);
						newClazz += clazz.substr(clazz.indexOf(name) + name.length);
					}
					this.e.className = newClazz.trim();
					return false;
				}
			}; 
		}


function updateTabState(e) {
	// Adjust navigation bar
	var nav = e.parentElement.parentElement;
	var links = nav.getElementsByTagName("a");
	var visibleIndex = -1;
	for (var i = 0; i < links.length; i++) {
		if (links[i] == e) {
			links[i].className = 'selected';
			visibleIndex = i;
		} else {
			links[i].className = '';
		}
	}

	// Adjust div's
	var tabpane = e.parentElement.parentElement.parentElement;
	var tabs = tabpane.getElementsByTagName("div");
	var j = 0;
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i].className.indexOf('tab') > -1) {
			if (j == visibleIndex) {
				tabs[i].className = 'tab';
				console.log("Make visible");
			} else {
				tabs[i].className = 'tab hidden';
				console.log("Hide");
			}
			j++;
		}
	}
}

function initTabs() {
	// Find all div boxes
	var allDivs = document.getElementsByTagName("div");
	for (var i = 0; i < allDivs.length; i++) {
		if (allDivs[i].className.indexOf('tabpane') > -1) {
			// Work on the current div box
			var current = allDivs[i];
			var nav = current.getElementsByTagName("ul")[0];

			var links = nav.getElementsByTagName("a");
			for (var j = 0; j < links.length; j++) {
				links[j].onclick = function(e) {
					updateTabState(e.target);
					return false;
				};
			}
		}
	}
}

function jsCheckDisable() {
	document.getElementById("jscheck").style.display = "none";
}

window.onload = function() {
	jsCheckDisable();
	initTabs();
};