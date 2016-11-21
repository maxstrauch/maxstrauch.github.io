

function attachOnClick(id, funct) {
	var e = null;
	try {
		e = document.getElementById(id);
	} catch (ex) {
		return;
	}

	if (e == null) {
		return;
	}

	e.onclick = function () {
		funct();
		return false;
	};
}

var oldOnLoad = window.onload;
window.onload = function() {
	oldOnLoad();


	attachOnClick("addQuestion", function () {
		var questionPlace = document.getElementById("questionplace");
		var id = questionplace.children.length;



		var root, tmp, tmp1;



		root = document.createElement("blockquote");
		root.className = "inv question";
		root.id = "q" + id;
		questionPlace.appendChild(root);


		tmp = document.createElement("strong");
		tmp.innerHTML = "Fragentext";
		root.appendChild(tmp);


		tmp = document.createElement("input");
		tmp.type = "text";
		tmp.className = "large";
		tmp.name = "q" + id;
		root.appendChild(tmp);


		tmp = document.createElement("button");
		tmp.className = "right drop slim";
		tmp.rel = "q" + id;
		tmp.innerHTML = "&times;";
		tmp.onclick = function(e) {
			//alert(this.rel + " = REL");

			var root = document.getElementById(this.rel);

			questionPlace.removeChild(root);

			return false;
		};
		
		if (questionPlace.children.length > 1) {
			root.appendChild(tmp);
		}

		root.appendChild(document.createElement("hr"));





		tmp = document.createElement("strong");
		tmp.innerHTML = "Wahloptionen";
		root.appendChild(tmp);


		tmp = document.createElement("select");
		tmp.name = "q" + id + "_select";
		tmp.id = "q" + id + "_select";


		root.appendChild(tmp);





		var updateSelect = function(rel) {
			var idOfSelect = rel.substr(0, rel.indexOf('_')) + "_select";
			var select = document.getElementById(idOfSelect);

			var idOfAnswers = rel.substr(0, rel.indexOf('_')) + "_answerplace";
			var answers = document.getElementById(idOfAnswers);

			// Equal amount
			if(answers.children.length == select.children.length) {
				return;
			}

			if (answers.children.length > select.children.length) {
				// Add node
				tmp1 = document.createElement("option");
				tmp1.innerHTML = answers.children.length;
				tmp1.value = tmp1.innerHTML;
				select.appendChild(tmp1);
			}

			if (answers.children.length < select.children.length) {
				// Remove node
				select.removeChild(select.lastChild);
			}


		};




		tmp = document.createElement("div");
		tmp.id = "q" + id + "_answerplace";
	


		root.appendChild(tmp);



		tmp = document.createElement("button");
		tmp.className = "right slim";
		tmp.rel = "q" + id + "_answerplace";
		tmp.innerHTML = "+";
		tmp.onclick = function(e, canRemove) {


			//alert(this.rel + " = REL");







			var root = document.createElement("blockquote");
			root.className = "text-left answer";
			root.id = this.rel + "_a" + document.getElementById(this.rel).children.length;
			document.getElementById(this.rel).appendChild(root);


			tmp = document.createElement("strong");
			tmp.innerHTML = "Antwort: ";
			root.appendChild(tmp);



			tmp = document.createElement("input");
			tmp.type = "text";
			tmp.className = "small";
			tmp.name = "q" + id + "_a0";  //TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			root.appendChild(tmp);

			tmp = document.createElement("button");
			tmp.className = "right drop slim";
			tmp.rel = root.id;
			tmp.innerHTML = "&times;";
			tmp.onclick = function(e) {
			//	alert(this.rel + " = REL");

				var root = document.getElementById(this.rel);
				this.parentNode.parentNode.removeChild(root);


				updateSelect(this.rel);


				return false;
			};
			
			if (canRemove == null || canRemove) {
				root.appendChild(tmp);	
			}
			

			root.appendChild(document.createElement("hr"));

			tmp = document.createElement("strong");
			tmp.innerHTML = "Beschreibung: ";
			root.appendChild(tmp);


			tmp = document.createElement("input");
			tmp.type = "text";
			tmp.className = "large";
			tmp.name = "q" + id + "_a0_desc"; 
			root.appendChild(tmp);

			updateSelect(this.rel);



			return false;
		};

		var savedTmp = tmp;


		root.appendChild(tmp);




		tmp = document.createElement("div");
		tmp.className = "ignore clearfix";
		root.appendChild(tmp);




		// Create one answer
		savedTmp.onclick(null, false);

		
	});






	// PARTICIPANTS

	var list = document.getElementById("participants");

	attachOnClick('removeParticipants', function () {
		var opts = list.getElementsByTagName("option");
		
		var changed = false;
		do {
			changed = false;

			for (var i = 0; i < opts.length; i++) {
				if (opts[i].selected) {
					//console.log(opts[i]);
					list.removeChild(opts[i]);

					changed = true;
				}
			}

		} while (changed);

		
	});

	attachOnClick('addParticipantGroup', function () {
		
		var mails = document.getElementById("participantGroups").selectedOptions[0].value.split(";");
		for (var i = 0; i < mails.length; i++) {
			if (mails[i].length > 0) {
				var elem = document.createElement("option");
				elem.value = mails[i].trim();
				elem.text = elem.value;
				list.add(elem);
			}
		}


	});

	attachOnClick('addParticipant', function () {
		
		var mail = document.getElementById("participantList").selectedOptions[0].value;
		
		if (mail.length > 0) {
			var elem = document.createElement("option");
			elem.value = mail.trim();
			elem.text = elem.value;
			list.add(elem);
		}
	
	});

	attachOnClick('addParticipantsFromText', function () {
		var text = document.getElementById("rawParticipants").value;
	
	// http://stackoverflow.com/questions/520611/how-can-i-match-multiple-occurrences-with-a-regex-in-javascript-similar-to-phps
// Return all pattern matches with captured groups
RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        //var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                //matchArray.push(match[i]);
                matches.push(match[i]);
            }
        }
        //matches.push(matchArray);
    }
    return matches;
}

		var matches = /[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g.execAll(text);

		for (var i = 0; i < matches.length; i++) {
			if (matches[i].length > 0 && matches[i].indexOf('@') > 0) {
				var elem = document.createElement("option");
				elem.value = matches[i].trim();
				elem.text = elem.value;
				list.add(elem);
			}
		}

	});


// ORGANISATOR

	attachOnClick("addOrga", function () {

		var opt = document.getElementById("organisatorsAll").selectedOptions;

		if (opt.length < 1) {
			return;
		}

		opt = opt[0];

		var list = document.getElementById("organisators");
				var elem = document.createElement("option");
				elem.value = opt.value;
				elem.text = opt.text;
				list.add(elem);

	});



	attachOnClick("removeOrga", function () {

		var opts = document.getElementById("organisators").selectedOptions;

		if (opts.length < 1) {
			return;
		}


		var list = document.getElementById("organisators");

		var changed = false;
		do {
			changed = false;

			for (var i = 0; i < opts.length; i++) {
				if (opts[i].selected) {
					//console.log(opts[i]);
					list.removeChild(opts[i]);

					changed = true;
				}
			}

		} while (changed);

	});



};