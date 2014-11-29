/**
 * puissance4.js
 * * 
 * @auteur     marc laville
 * @Copyleft 2013
 * @date       07/09/2013
 * @version    0.9
 * @revision   $0$
 *
 * Puissance 4
 *
 * A Faire :
 * -  signaler l'arrivée du second joueur au premier
 * -  commentaire
 * -  listener sur les deconnexion
 * 
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */
var appPuissance4 = (function ( url, document ) {

  var jeu = new Firebase(url),
	totAlign = 4,
	piste = document.querySelector('ol.jeu'),
	bts = piste.querySelectorAll('li button'),
//	colJeu = document.querySelectorAll('ol>li'),
	colJeu = piste.querySelectorAll('ol>li'),
	frmAffichage = document.forms['affichage'],
	partie = null,
	joueur = 0,
	aMoi = true,
	couleur = 'rouge',
	increment = function(nb) { return nb + 1; },
	
	/**
	 * Contrôle l'alignement de 4 jetons
	 * Chaque test renvoi le tableau des jetons alignés avec le jeton qui vient d'être joué
	 */
	/*
	 * Alignement vertical
	 */
	testVerticale = function(cell) {
		var tabCell = [cell],
			coul = cell.className,
			cellCour = cell.nextSibling;
		
		/* recherche un alignement sur la ligne */
		while( cellCour && tabCell.length <= totAlign ) {
			if(cellCour.classList.contains(coul)) {
				tabCell.push( cellCour );
				cellCour = cellCour.nextSibling;
			} else {
				cellCour = null;
			}
		}
		
		cellCour = cell.previousSibling;
		while( cellCour && tabCell.length <= totAlign ) {
			if(cellCour.classList.contains(coul)) {
				tabCell.push( cellCour );
				cellCour = cellCour.previousSibling;
			} else {
				cellCour = null;
			}
		}
		
		return tabCell; 
	},
	/*
	 * Alignement horizontal
	 */
	testHorizontale = function(cell, row) {
		var tabCell = [cell],
			coul = cell.className,
			colCour = cell.parentNode.parentNode.nextElementSibling;
	
		/* recherche un alignement sur la ligne */
		while( colCour && tabCell.length < totAlign ) {
			var cellCour = colCour.querySelectorAll('li')[row - 1];
			
			if(cellCour.classList.contains(coul)) {
				tabCell.push( cellCour );
				colCour = colCour.nextElementSibling;
			} else {
				colCour = null;
			}
		}
		
		colCour = cell.parentNode.parentNode.previousElementSibling;
		while( colCour && tabCell.length < totAlign ) {
			var cellCour = colCour.querySelectorAll('li')[row - 1];
			
			if(cellCour.classList.contains(coul)) {
				tabCell.push( cellCour );
				colCour = colCour.previousElementSibling;
			} else {
				colCour = null;
			}
		}

		return tabCell; 
	},
	testDiagonaleAsc = function(cell, row) {
		var tabCell = [cell],
			coul = cell.className,
			colCour = cell.parentNode.parentNode.nextElementSibling,
			rowCour = row - 1;
			
		/* recherche un alignement sur la diagonale ascendante */
		while( colCour && rowCour > 0 && tabCell.length < totAlign ) {
			var cellCour = colCour.querySelectorAll('li')[rowCour - 1];
			
			if(cellCour.classList.contains(coul)) {
				tabCell.push(cellCour);
				colCour = colCour.nextElementSibling;
				rowCour--;
			} else {
				colCour = null;
			}
		}
		
		colCour = cell.parentNode.parentNode.previousElementSibling,
		rowCour = row + 1;
		while( colCour && rowCour < 7 && tabCell.length < totAlign ) {
			var cellCour = colCour.querySelectorAll('li')[rowCour - 1];
			
			if(cellCour.classList.contains(coul)) {
				tabCell.push(cellCour);
				colCour = colCour.previousElementSibling;
				rowCour++;
			} else {
				colCour = null;
			}
		}

		return tabCell; 
	},
	testDiagonaleDesc = function(cell, row) {
		var tabCell = [cell],
			coul = cell.className,
			colCour = cell.parentNode.parentNode.nextElementSibling,
			rowCour = row + 1;

		/* recherche un alignement sur la diagonale descendante */
		while( colCour && rowCour < 7 && tabCell.length < totAlign ) {
			var cellCour = colCour.querySelectorAll('li')[rowCour - 1];
			
			if(cellCour.classList.contains(coul)) {
				tabCell.push(cellCour);
				colCour = colCour.nextElementSibling;
				rowCour++;
			} else {
				colCour = null;
			}
		}
		
		colCour = cell.parentNode.parentNode.previousElementSibling,
		rowCour = row - 1;
		while( colCour && rowCour > 0 && tabCell.length < totAlign ) {
			var cellCour = colCour.querySelectorAll('li')[rowCour - 1];
			
			if(cellCour.classList.contains(coul)) {
				tabCell.push(cellCour);
				colCour = colCour.previousElementSibling;
				rowCour--;
			} else {
				colCour = null;
			}
		}
		
		return tabCell; 
	},
	// Reponse à l'enregistrement d'un coup
	afficheCoup = function(snapCoup) {
		var coup = snapCoup.val();
			col = coup.colonne;
			
		if(col != undefined) {
			var cell = colJeu[col - 1].querySelector('li:last-child'),
				rang = 6,
				cellOk = null;

			while(cell) {
				if(cell.className == '') {
					cell.classList.add(coup.couleur);
					cellOk = cell;
					cell = null;
				} else {
					cell = cell.previousSibling;
					rang--;
				}
			}
			if(cellOk) {
				var cells = testVerticale(cellOk);
				
				if(!(cells.length >= totAlign)) {
					cells = testHorizontale(cellOk, rang);
					
					if(!(cells.length >= totAlign)) {
						cells = testDiagonaleAsc(cellOk, rang);
						
						if(!(cells.length >= totAlign)) {
							cells = testDiagonaleDesc(cellOk, rang);
						}
					}
				}
				
				if(cells.length >= totAlign) {
					cells.forEach(function(el) { return el.classList.add('zoom'); });
				}
			}
			
			aMoi = !aMoi;
		}
		
		return;
	}
	/*
	 * Appelé à la récupération du numéro de la derniere partie
	 * Pose la candidature pour la partie dont le numero est renvoyée
	 *
	 * snapNum.val() renvoi le numero de la dernière partie en cours
	 *
	 */
	// A faire : signaler l'arrivée du second joueur au premier
	candidatePartie = function(snapNum) {
		// Affiche le numero de partie et incremente le nb de joueur
		frmAffichage.numPartie.value = ('000000' + snapNum.val()).slice(-6);
		partie = jeu.child(frmAffichage.numPartie.value).child('partie'); // pointe sur numPartie/partie
		
		// increment le nb de joueur
		partie.child('nbJoueurs').transaction(increment, // pointe sur numPartie/nbJoueurs
			function(error, committed, snapshot) {
			  if (error)
				alert('nbJoueurs : Transaction failed abnormally !', error);
			  else if (!committed)
				alert('Transaction aborted !');
			  else {
				var nbJoueur = 0 + snapshot.val();
				
				if (2 >= nbJoueur) {
				
					joueur = nbJoueur;
					frmAffichage.chkCouleur.checked = (joueur == 1);
					if (1 == joueur) {
						couleur = 'rouge';
						// Attente du deuxieme joueur
						frmAffichage.attente.value = 'attente joueur ';
						partie.child( 'nbJoueurs' ).once( 'value', function(snapshot) {
						
							if(2 == 0 + snapshot.val())
								frmAffichage.attente.value = '2eme joueur OK';
						});
					} else {
						couleur = 'jaune';
						aMoi = false;
						frmAffichage.attente.value = '1er joueur OK';
					}
				
					partie.on('child_added', afficheCoup);
					// UI
					piste.classList.add(couleur);
					for( var i = 0, nbBts = bts.length; i < nbBts ; i++ ) {
						bts[i].addEventListener('click', joue);
					}

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
	},
	joue = function(e) {
		if(aMoi) {
			partie.push({ couleur: couleur, colonne: e.target.parentNode.dataset.col });
		}
	}

	return {
		// Lorsque l'on récupère le numero de la dernière partie, on candidate
		init: function( ) { return jeu.child('numPartie').once('value', candidatePartie); },

	};
  
})('https://polinux-chrono.firebaseio.com/jeu/puissance4', window.document);

appPuissance4.init();
