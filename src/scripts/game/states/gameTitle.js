define(['Phaser','MyGame'], function(Phaser, MyGame) {
    'use strict';

    MyGame.BG = {};

    MyGame.GameTitle = function(game) {};

	MyGame.GameTitle.prototype = {
		 preload: function(){
		 	this.add.sprite(0, 0, MyGame.BG.starfieldData);
		 	MyGame.BG.starfield.velocity(0.0005,0.0005);
		 },

	     create: function(){

	     	  MyGame.BG.starfield.run();

	          var title = this.add.sprite(this.game.width / 2, -100, 'gametitle');
	          title.anchor.set(0.5); 
	          
	          // var grid = this.add.sprite(this.game.width / 2, 130, 'gridedition');
	          // grid.anchor.set(0.5);

	          var playData = this.add.bitmapData(250,80);
	          playData.fill(255,255,255,1)
	          
	          var playTrailBtn = this.add.button(this.game.width / 2 , this.game.height / 2 - 60, playData, function(){this.state.start('GameRastro')}.bind(this));
	          playTrailBtn.anchor.set(0.5);
	          var playTrailTxt = this.game.add.text(0, 0, 'Modo Rastro', { font: '3em Arial', fill: '#020028', align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle', wordWrap: true, wordWrapWidth: playData.width });
	          playTrailTxt.anchor.set(0.5);
	          playTrailBtn.addChild(playTrailTxt);
	          playTrailBtn.scale.x = 0;
	          playTrailBtn.scale.y = 0;

	          var playDesvioBtn = this.add.button(this.game.width / 2 , this.game.height / 2 + 60, playData, function(){this.state.start('GameDesvio')}.bind(this));
	          playDesvioBtn.anchor.set(0.5);
	          var playDesvioTxt = this.game.add.text(0, 0, 'Modo Desvio', { font: '3em Arial', fill: '#020028', align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle', wordWrap: true, wordWrapWidth: playData.width });
	          playDesvioTxt.anchor.set(0.5);
	          playDesvioBtn.addChild(playDesvioTxt);
	          playDesvioBtn.scale.x = 0;
	          playDesvioBtn.scale.y = 0;

	          var infoGroup = this.add.group();

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

			  infoGroup.addMultiple([creditos,author,howText],true);
			  infoGroup.y = infoGroup.height;


			  this.add.tween(title).to({y:100}, 600, Phaser.Easing.Elastic.Out).start();
			  this.add.tween(infoGroup).to({y:0}, 600, Phaser.Easing.Elastic.Out).start();
			  
			  this.add.tween(playTrailBtn.scale).to({x:1,y:1}, 600, Phaser.Easing.Bounce.Out).start();
			  this.add.tween(playDesvioBtn.scale).to({x:1,y:1}, 600, Phaser.Easing.Bounce.Out).delay(100).start();

	          
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
	     },
	     update: function(){
	     	MyGame.BG.starfield.run();
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
