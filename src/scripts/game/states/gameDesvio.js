define(['Phaser','SineWaves','MyGame'], function(Phaser, SineWaves, MyGame) {
    'use strict';

    var game, score, dead,
    	waveW, waveGroup, waveSprite, wavesData, waves,
    	playerData, playerSprite, playerSpriteLeft, playerSpriteRight,
    	enemyData, enemyGroup,
    	scoreText, menuGroup,
    	cursors, wasd, shift, touchAmmount,
    	r = 0;

    MyGame.GameDesvio = function(game) {};

	MyGame.GameDesvio.prototype = {
	  preload: function() {
		this.add.sprite(0, 0, MyGame.BG.starfieldData);
		MyGame.BG.starfield.velocity(0.001,0);
	  },
	  create: function(){

	  	MyGame.BG.starfield.run();

	    score = 0;
	    dead = false;
	  	game = this.game;
	    waveW = MyGame.PLAYER.waveW;
	    wavesData = MyGame.PLAYER.wavesData;
	    waves = MyGame.PLAYER.waves;
	    waves.options.speed = 6;

	    game.world.setBounds(0, 0, game.width, game.height);

	    playerData = game.add.bitmapData(16,16);
	    playerData.circle(8,8, 8, '#FFFFFF');

	    // ENEMY
	    scoreText = game.add.text(game.world.centerX,game.world.centerY,score,{
	         font:'bold 400px Arial',
	         fill: '#acacac',
	         align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle'
	    });
	    scoreText.alpha = .1;
	    scoreText.anchor.setTo(0.5);

	    // WAVE + PLAYER
	    waveGroup = game.add.group();
	    waveGroup.x = game.width/2;
	    waveGroup.y = game.height/2;
	    waveGroup.pivot.x = wavesData.width/2;
	    waveGroup.pivot.y = wavesData.height/2;
	    waveGroup.angle = r;

	    waveSprite = waveGroup.create(waveW/2,waveW/2,wavesData);
	    waveSprite.anchor.setTo(0.5);

	    var pointParticle = waves.getPoint(waves.time, waves.waveWidth/2, waves.waves[0]);
	    playerSprite = waveGroup.create(pointParticle.x, pointParticle.y,playerData);
	    playerSprite.anchor.setTo(0.5);

	    pointParticle = waves.getPoint(waves.time, 0 + (waves.waveWidth*0.1), waves.waves[0]);
	    playerSpriteLeft = waveGroup.create(pointParticle.x, pointParticle.y,playerData);
	    playerSpriteLeft.anchor.setTo(0.5);

	    
	    pointParticle = waves.getPoint(waves.time, waves.waveWidth - (waves.waveWidth*0.1), waves.waves[0]); 
	    playerSpriteRight = waveGroup.create(pointParticle.x, pointParticle.y,playerData);
	    playerSpriteRight.anchor.setTo(0.5);   

	    // ENEMY
	    enemyGroup = game.add.group();

	    // ARCADE PHYSICS
		game.physics.startSystem(Phaser.Physics.ARCADE);
	    game.physics.arcade.enable([playerSprite,playerSpriteLeft,playerSpriteRight,waveSprite]);

	    playerSprite.body.allowGravity = false;
	    playerSprite.body.immovable = true;

	    playerSpriteLeft.body.allowGravity = false;
	    playerSpriteLeft.body.immovable = true;

	    playerSpriteRight.body.allowGravity = false;
	    playerSpriteRight.body.immovable = true;

	    enemyData = game.add.bitmapData(16,16);
	    enemyData.circle(8,8, 8, '#FF0000');
	    
	    game.time.events.loop(1000, createEnemy, this); 
	    
	    cursors = game.input.keyboard.createCursorKeys();
	    wasd = game.input.keyboard.addKeys( { 'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D } );
	    shift = game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

	    game.input.mouse.mouseWheelCallback = function(event){
	         r = r > 360 ? r - 360 : r < 0 ? r + 360 : r + game.input.mouse.wheelDelta*5;
	         // waves.rotation = r * Math.PI / 180;
	         waveGroup.angle = r;

	    }

	    game.input.onDown.add(function(event){
	    	// console.log('down');
	    	touchAmmount = game.input.x;
	    });

	    game.input.onUp.add(function(event){
	    	// console.log('up');
	    	r = waveGroup.angle;
	    });

		game.input.mouse.mouseMoveCallback = function(event) {
			// console.log('move');
			if (game.input.activePointer.isDown) {
		    	var ammount = -(touchAmmount - game.input.x);
		    	var rot = r + ammount > 360 ? r + ammount - 360 : r + ammount < 0 ? r + ammount + 360 : r + ammount;
		    	waveGroup.angle = rot;
	    	}
		};

	    game.input.touch.touchMoveCallback = function(event){
	    	var ammount = -(touchAmmount - game.input.x);
	    	var rot = r + ammount > 360 ? r + ammount - 360 : r + ammount < 0 ? r + ammount + 360 : r + ammount;
	    	waveGroup.angle = rot;    
	    };

	    menuGroup = game.add.group();
	    menuGroup.alpha = 0;
	    // var menuButton = game.add.button(game.width / 2, game.height - 30, 'menubutton', toggleMenu);
	    // menuButton.anchor.set(0.5);
	    // menuGroup.add(menuButton);
	    var resetGame = game.add.button(game.width / 2, game.height + 80, 'resetgame', function(){
	         game.state.start('GameDesvio');
	    });
	    resetGame.anchor.set(0.5);
	    menuGroup.add(resetGame);
	    
	    var thankYou = game.add.button(game.width / 2, game.height + 140, 'thankyou', function(){
	    	game.state.start('GameTitle');
	    });
	    thankYou.anchor.set(0.5);
	    menuGroup.add(thankYou);

	    // game.camera.follow(waveSprite);

	    game.time.events.loop(Phaser.Timer.SECOND, updateScore, this);
	  },
	  update: function(){

		    if (cursors.up.isDown || cursors.right.isDown || wasd.up.isDown || wasd.right.isDown)
		    {
		        //  If the shift key is also pressed then the world is rotated
		        if (shift.isDown)
		        {
		        	r += 5;
		            waveGroup.angle = r;
		        }
		        else
		        {
		            r += 1;
		            waveGroup.angle = r;
		        }
		    }

		    if (cursors.down.isDown || cursors.left.isDown || wasd.down.isDown || wasd.left.isDown)
		    {
		        //  If the shift key is also pressed then the world is rotated
		        if (shift.isDown)
		        {
		        	r -= 5;
		            waveGroup.angle = r;
		        }
		        else
		        {
		            r -= 1;
		            waveGroup.angle = r;
		        }
		    }

	      // waveSprite.body.velocity.x = 60;
	      // playerSprite.body.velocity.x = 60;
	      // playerSpriteLeft.body.velocity.x = 60;
	      // playerSpriteRight.body.velocity.x = 60;

		  MyGame.BG.starfield.run();
	      waves.update();

	      var pointParticle = waves.getPoint(waves.time, waves.waveWidth/2, waves.waves[0]);
	      // playerSprite.x = pointParticle.x;
	      playerSprite.y = pointParticle.y;

	      pointParticle = waves.getPoint(waves.time, 0 + (waves.waveWidth*0.1), waves.waves[0]);
	      // playerSpriteLeft.x = pointParticle.x;
	      playerSpriteLeft.y = pointParticle.y;

	      pointParticle = waves.getPoint(waves.time, waves.waveWidth - (waves.waveWidth*0.1), waves.waves[0]);
	      // playerSpriteRight.x = pointParticle.x;
	      playerSpriteRight.y = pointParticle.y;

	      // playerData.circle(pointParticle.x, pointParticle.y, 8, '#FFFFFF');
	      pointParticle = void 0;

	      // wavesData.update();
	      wavesData.dirty = true;
	      playerData.dirty = true;

	    // if (cursors.down.isDown) {
	    //     player.body.velocity.y = - 60;    
	    // } else {
	    //     player.body.velocity.y = 60;    
	    // }
	    // game.world.resize(game.world.width + player.body.velocity.x, game.world.height);

	      game.physics.arcade.collide([playerSprite,playerSpriteLeft,playerSpriteRight], enemyGroup, enemyCollide,null,this);
	  },
	  render: function(){
	    // game.debug.cameraInfo(game.camera, 32, 32);
	    // game.debug.spriteCoords(waveSprite, 32, 500);
	  }
	}

	function createEnemy(){
	     // if (!dead) scoreText.text = ++score;

	     var enemySprite = enemyGroup.create(game.world.randomX,0,enemyData);
	     enemySprite.anchor.setTo(0.5);

	     game.physics.arcade.enable(enemySprite);
	     
	     enemySprite.body.velocity.y = 250;
	     enemySprite.body.velocity.x = 250;

	     enemySprite.body.bounce.y = 1;
	     enemySprite.body.bounce.x = 1;
	     enemySprite.body.angle = game.rnd.integerInRange(0,1);
	     enemySprite.body.collideWorldBounds = true;
	}

	function updateScore(){
		if (!dead) scoreText.setText(++score);
	}

	function enemyCollide(el1,el2){
		// console.log(el1,el2);
		dead = true;
		scoreText.alpha = 1;
		// scoreText.parent.bringToTop(scoreText);
		menuGroup.alpha = 1;
		var menuTween = game.add.tween(menuGroup).to({
		    y: -180     
		}, 500, Phaser.Easing.Bounce.Out, true);
      }

	return MyGame.GameDesvio;
});
