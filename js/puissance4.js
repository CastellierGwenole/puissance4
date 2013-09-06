// jeu : new Firebase('https://polinux-chrono.firebaseio.com/jeu/puissance4'),


var appPuissance4 = (function ( url ) {

  var jeu = new Firebase(url),
	lancePartie = function(v) {
		numPartie = jeu.child(('000000' + nPartie).slice(-6)).child('partie');
	},
	numPartie = 0;

  // A private function which logs any arguments
  myPrivateMethod = function( foo ) {
      console.log( foo );
  };
  
	return {

		// A public variable
		myPublicVar: "foo",
		
		init: function( ) {
//			numPartie = jeu.child('numPartie');
			
			jeu.child('numPartie').once('value', function (snapshot) {
				"use strict";
				return lancePartie(snapshot.val()); 
			});
			return;
		},

		// A public function utilizing privates
		myPublicFunction: function( bar ) {

		  // Increment our private counter
		  myPrivateVar++;

		  // Call our private method using bar
		  myPrivateMethod( bar );

		}
	  };
  
})('https://polinux-chrono.firebaseio.com/jeu/puissance4');

var np = appPuissance4.init();
/*
var appPuissance4 = {

	jeu : new Firebase('https://polinux-chrono.firebaseio.com/jeu/puissance4'),
	
//	numPartie : appPuissance4.jeu.child('numPartie'),
	numPartie : 0,

	myProperty: "someValue",

	myConfig: {
		useCaching: true,
		language: "en"
	}
	
	init:function()
};
*/