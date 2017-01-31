/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

/*function show(){
    this.classList.add('show');
}




button.addEventListener('click', show); */

function listClick(){
	this.classList.show("filter");
}

appel = document.getElementByClassName("container-menu");
var i;
for (i = 0; i < appel.length; ++i){
	appel[i].addEventListener('click', ListClick);
}