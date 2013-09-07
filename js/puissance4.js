/**
 * puissance4.js
 * * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       07/09/2013
 * @version    0.1
 * @revision   $0$
 *
 * Puissance 4
 *
 * A Faire :
 * - standardisation du code + commentaire
 * - Utiliser les transaction pour les entrées dans la partie https://www.firebase.com/docs/transactions.html
 * - listener sur les deconnexion
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var appPuissance4 = (function ( url, document ) {

  var jeu = new Firebase(url),
	frmAffichage = document.forms['affichage'],
	colJeu = document.querySelectorAll('ol>li'),
	partie = null,
	joueur = 0,
	aMoi = true,
	couleur = 'rouge',
	increment = function(nb) { return nb + 1; },

	// Pose la candidature pour la partie dont le numero est renvoyée
	afficheCoup = function(snapCoup) {
		var coup = snapCoup.val();
			col = coup.colonne;
			
		if(col != undefined) {
			var cell = colJeu[col - 1].querySelector('li:last-child');

			while(cell) {
				if(cell.className == '') {
					cell.classList.add(coup.couleur);
					cell = null;
				} else {
					cell = cell.previousSibling;
				}
			}
			aMoi = !aMoi;
		}
		
		return;
	}
	// Pose la candidature pour la partie dont le numero est renvoyée
	candidatePartie = function(snapNum) {
		// Affiche le numero de partie et incremente le nb de joueur
		frmAffichage.numPartie.value = ('000000' + snapNum.val()).slice(-6);
		partie = jeu.child(frmAffichage.numPartie.value).child('partie');
		
		// increment le nb de joueur
		partie.child('nbJoueurs').transaction(increment,
			function(error, committed, snapshot) {
			  if (error)
				alert('nbJoueurs : Transaction failed abnormally !', error);
			  else if (!committed)
				alert('Transaction aborted !');
			  else {
				var nbJoueur = 0 + snapshot.val();
				
				if (2 >= nbJoueur) {
				
					joueur = nbJoueur;
					document.getElementById('nbJoueur').textContent = (joueur == 1) ? 'A' : 'B';
					
					if (1 == joueur) {
						couleur = 'rouge';
						// Attente du deuxieme joueur
						document.getElementById('attente').textContent = 'attente joueur ';
						partie.child( 'nbJoueurs' ).once( 'value', function(snapshot) {
						
							if(2 == 0 + snapshot.val())
								document.getElementById('attente').textContent = '2eme joueur OK';
						});
					} else {
						couleur = 'jaune';
						aMoi = false;
						document.getElementById('attente').textContent = '1er joueur OK';
					}
				
					partie.on('child_added', afficheCoup);
				} else {
					// Création d'une nouvelle partie
					document.getElementById('numPartie').textContent = 'Nouvelle Partie ';
					jeu.child('numPartie').transaction(increment,
						function(error, committed, snapshot) {
						  if (error)
							alert('numPartie : Transaction failed abnormally !', error);
						  else if (!committed)
							alert('Transaction aborted !');
						  else
							candidatePartie(snapshot);
					});

				}
			  }
		});
	}

	return {
		// Lorsque l'on récupère le numero de la dernière partie, on candidate
		init: function( ) { return jeu.child('numPartie').once('value', candidatePartie); },

		joue: function(e) {
			if(aMoi) {
				partie.push({ couleur: couleur, colonne: e.target.parentNode.dataset.col });
			}
		}
	};
  
})('https://polinux-chrono.firebaseio.com/jeu/puissance4', window.document);

var bts = document.querySelectorAll('ol li button'),
	nbBts = bts.length;
	
appPuissance4.init();
for( var i = 0 ; i < nbBts ; i++ ) {
	bts[i].addEventListener('click', appPuissance4.joue);
}
