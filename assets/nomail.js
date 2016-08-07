/**
 * 2016 by Maximilian Strauch.
 */
window.onload = function() {
  var es = document.getElementsByClassName("magic");
  for (var i = 0; i < es.length; i++) {
    var a = document.createElement("a");
    a.href = "ma" + 'ilt' + 'o:' + (a.innerHTML = es[i].getAttribute("data-str").split('').reverse().join('').replace(/24/g, ''));
    es[i].innerHTML = '';
    es[i].appendChild(a);
  }
}