define(['Phaser','MyGame'], function(Phaser, MyGame) {
    'use strict';

    MyGame.GameTitle = function(game) {};

	MyGame.GameTitle.prototype = {
	     create: function(){

	          var title = this.add.sprite(this.game.width / 2, 100, 'gametitle');
	          title.anchor.set(0.5); 
	          
	          // var grid = this.add.sprite(this.game.width / 2, 130, 'gridedition');
	          // grid.anchor.set(0.5);

	          var playData = this.add.bitmapData(250,80);
	          playData.fill(255,255,255,1)
	          
	          var playButton = this.add.button(this.game.width / 2 , this.game.height / 2 + 60, playData, function(){this.state.start('GameDesvio')}.bind(this));
	          playButton.anchor.set(0.5);
	          var playDesvio = this.game.add.text(0, 0, 'Modo Desvio', { font: '3em Arial', fill: '#020028', align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle', wordWrap: true, wordWrapWidth: playData.width });
	          playDesvio.anchor.set(0.5);
	          playButton.addChild(playDesvio);

	          var playButton = this.add.button(this.game.width / 2 , this.game.height / 2 - 60, playData, function(){this.state.start('GameRastro')}.bind(this));
	          playButton.anchor.set(0.5);
	          
	          var playTrail = this.game.add.text(0, 0, 'Modo Rastro', { font: '3em Arial', fill: '#020028', align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle', wordWrap: true, wordWrapWidth: playData.width });
	          playTrail.anchor.set(0.5);
	          playButton.addChild(playTrail);

	          var creditos = this.add.text(this.game.width / 2, this.game.height - 55, '--- Autor ---', { font:'1.6em Arial', fill: '#acacac', align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle'});
	          creditos.anchor.set(0.5);

	          var author = this.add.text(this.game.width / 2, this.game.height - 30, 'Acemir Sousa Mendes', { font:'2.6em Arial', fill: '#acacac', align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle'});
	          author.anchor.set(0.5);

				var howText = this.game.add.text(this.game.width / 2,this.game.height - 140,'COMO JOGAR\nEvite os círculos vermelhos.\nGire a onda com mouse, teclado ou touch.',{
				     font:'1.6em Arial',
				     fill: '#acacac',
				     align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle'
				});
				howText.anchor.setTo(0.5);

	          
	          // this.menuGroup = this.add.group();
	          
	          // var menuButton = this.add.button(this.game.width / 2, this.game.height - 30, 'menubutton', toggleMenu.bind(this) );
	          // menuButton.anchor.set(0.5);
	          // this.menuGroup.add(menuButton);
	          
	          // var resetGame = this.add.button(this.game.width / 2, this.game.height + 50, 'resetgame', function(){});
	          // resetGame.anchor.set(0.5);
	          // this.menuGroup.add(resetGame);
	          
	          // var thankYou = this.add.button(this.game.width / 2, this.game.height + 130, 'thankyou', function(){});
	          // thankYou.anchor.set(0.5);
	          // this.menuGroup.add(thankYou);          
	     }
	}

	function toggleMenu(){

	     if(this.menuGroup.y == 0){
	          var menuTween = this.add.tween(this.menuGroup).to({
	               y: -180     
	          }, 500, Phaser.Easing.Bounce.Out, true);
	     }
	     if(this.menuGroup.y == -180){
	          var menuTween = this.add.tween(this.menuGroup).to({
	               y: 0    
	          }, 500, Phaser.Easing.Bounce.Out, true);     
	     }
	}

	return MyGame.GameTitle;
});
