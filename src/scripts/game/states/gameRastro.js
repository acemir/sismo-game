define(['Phaser','SineWaves','MyGame'], function(Phaser, SineWaves, MyGame) {
    'use strict';

    var game, score, dead,
    	waveW, waveGroup, waveSprite, wavesData, waves,
    	playerData, playerSprite, playerSpriteLeft, playerSpriteRight,
    	enemyData, enemyGroup,
    	scoreText, menuGroup,
    	pointParticle,
    	trail, trail1, trail2,
    	cursors, wasd, shift, touchAmmount,
    	r = 0,
    	startTrail = false;

    var trailTest, trailTestData, trailTestObj;
    var trailTest2, trailTestData2, trailTestObj2;
    var trailTest3, trailTestData3, trailTestObj3;

    MyGame.GameRastro = function(game) {};

	MyGame.GameRastro.prototype = {
      preload: function() {
		var starfieldSprite = this.add.sprite(0, 0, MyGame.BG.starfieldData);
		starfieldSprite.fixedToCamera = true;

		MyGame.BG.starfield.velocity(0,0.001);
      },
	  create: function(){
	  	MyGame.BG.starfield.run();

	    score = 0;
	    dead = false;
	  	game = this.game;
	    
	    waveW = MyGame.PLAYER.waveW;
	    wavesData = MyGame.PLAYER.wavesData;
	    waves = MyGame.PLAYER.waves;
	    waves.options.speed = 8;

	    // game.world.setBounds(0, 0, 20000, game.height);


	    playerData = game.add.bitmapData(16,16);
	    playerData.circle(8,8,8, '#FFFFFF');

	    // ENEMY
		scoreText = game.add.text(game.width/2,game.height/2,score,{
		   font:'bold 400px Arial',
		   fill: '#acacac',
		   align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle'
		});
		scoreText.alpha = .1;
		scoreText.fixedToCamera = true;
		scoreText.anchor.setTo(0.5);
    
	    // TRAILS
		// trail = game.add.graphics(0,0);
		// trail1 = game.add.graphics(0,0);
		// trail2 = game.add.graphics(0,0);

		trailTestData = game.add.bitmapData(game.world.width,game.world.height);
		trailTest = game.add.sprite(0, 0, trailTestData);
		trailTestData2 = game.add.bitmapData(game.world.width,game.world.height);
		trailTest2 = game.add.sprite(0, 0, trailTestData2);
		trailTestData3 = game.add.bitmapData(game.world.width,game.world.height);
		trailTest3 = game.add.sprite(0, 0, trailTestData3);

		// ENEMY
	    enemyGroup = game.add.group();
	

		// WAVE + PLAYER
		waveGroup = game.add.sprite(game.width/2,game.height/2, game.add.bitmapData(waveW,waveW));
		waveGroup.pivot.setTo(waveW/2);
		waveGroup.angle = r;

		waveSprite = game.add.sprite(0,0,wavesData);
		waveGroup.addChild(waveSprite);

		var pointParticle = waves.getPoint(waves.time, waves.waveWidth/2, waves.waves[0]);
		playerSprite = game.add.sprite(pointParticle.x, pointParticle.y,playerData);
		playerSprite.anchor.setTo(0.5);
		waveGroup.addChild(playerSprite);

		pointParticle = waves.getPoint(waves.time, 0 + (waves.waveWidth*0.1), waves.waves[0]);
		playerSpriteLeft = game.add.sprite(pointParticle.x, pointParticle.y,playerData);
		playerSpriteLeft.anchor.setTo(0.5);
		waveGroup.addChild(playerSpriteLeft);


		pointParticle = waves.getPoint(waves.time, waves.waveWidth - (waves.waveWidth*0.1), waves.waves[0]); 
		playerSpriteRight = game.add.sprite(pointParticle.x, pointParticle.y,playerData);
		playerSpriteRight.anchor.setTo(0.5);
		waveGroup.addChild(playerSpriteRight);

	    // ARCADE PHYSICS
		game.physics.startSystem(Phaser.Physics.ARCADE);
	    game.physics.arcade.enable([playerSprite,playerSpriteLeft,playerSpriteRight,waveGroup]);

	    playerSprite.body.allowGravity = false;
	    playerSprite.body.immovable = true;

	    playerSpriteLeft.body.allowGravity = false;
	    playerSpriteLeft.body.immovable = true;

	    playerSpriteRight.body.allowGravity = false;
	    playerSpriteRight.body.immovable = true;

	    enemyData = game.add.bitmapData(16,16);
	    enemyData.circle(8,8, 8, '#FF0000');
	    
	    game.time.events.loop(2000, createEnemy, this); 
	    

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
               game.state.start('GameRastro');
          });
          resetGame.anchor.set(0.5);
          menuGroup.add(resetGame);
          
          var thankYou = game.add.button(game.width / 2, game.height + 140, 'thankyou', function(){
          	game.state.start('GameTitle');
          });
          thankYou.anchor.set(0.5);
          menuGroup.add(thankYou);


          game.time.events.loop(Phaser.Timer.SECOND, updateScore, this);
          game.time.events.add(Phaser.Timer.QUARTER, function(){
			trailTestObj = new MyGame.createTrail();
			trailTestObj.init(trailTestData);
			trailTestObj2 = new MyGame.createTrail();
			trailTestObj2.init(trailTestData2);
			trailTestObj3 = new MyGame.createTrail();
			trailTestObj3.init(trailTestData3);
          	startTrail = true;
          }, this);


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

          // waveGroup.body.velocity.x = 120;
          MyGame.BG.starfield.run();
          waves.update();

          var pointParticle = waves.getPoint(waves.time, waves.waveWidth/2, waves.waves[0]);
          // playerSprite.x = pointParticle.x;
          playerSprite.y = pointParticle.y;

          pointParticle = waves.getPoint(waves.time, 0 + (waves.waveWidth*0.1), waves.waves[0]);
          // playerSpriteLeft.x = pointParticle.x;
          playerSpriteLeft.y = pointParticle.y;

          pointParticle = waves.getPoint(waves.time, waves.waveWidth - (waves.waveWidth*0.1) , waves.waves[0]);
          // playerSpriteRight.x = pointParticle.x;
          playerSpriteRight.y = pointParticle.y;

          // playerData.circle(pointParticle.x, pointParticle.y, 8, '#FFFFFF');
          pointParticle = void 0;


          // wavesData.update();
          wavesData.dirty = true;
          playerData.dirty = true;

          if (startTrail) {
	          trailTestObj.loop(playerSprite.world.x,playerSprite.world.y);
	          trailTestObj2.loop(playerSpriteLeft.world.x,playerSpriteLeft.world.y);
	          trailTestObj3.loop(playerSpriteRight.world.x,playerSpriteRight.world.y);
          }

          // trail.lineTo(playerSprite.world.x,playerSprite.world.y);
          // trail1.lineTo(playerSpriteLeft.world.x,playerSpriteLeft.world.y);
          // trail2.lineTo(playerSpriteRight.world.x,playerSpriteRight.world.y);

          // if (game.input.activePointer.isDown) {
          //   game.camera.follow(null);
          //   if (game.origDragPoint) {
          //     // move the camera by the amount the mouse has moved since last update
          //     game.camera.x += game.origDragPoint.x - game.input.activePointer.position.x;
          //     // game.camera.y += game.origDragPoint.y - game.input.activePointer.position.y;
          //   }
          //   // set new drag origin to current position
          //   game.origDragPoint = game.input.activePointer.position.clone();
          // }
          // else {
          //   game.origDragPoint = null;
          // }


          game.physics.arcade.overlap([playerSprite,playerSpriteLeft,playerSpriteRight], enemyGroup, enemyCollide,null,this);

	  },
	  render: function(){
          // game.debug.cameraInfo(game.camera, 32, 32);
          // game.debug.spriteBounds(playerSpriteLeft);
	  }
	}

	function createEnemy(){
	     // if (!dead) scoreText.text = ++score;

	     var enemySprite = enemyGroup.create(waveGroup.x + game.width/2, game.rnd.integerInRange(waveGroup.y - waveGroup.height/2, waveGroup.y + waveGroup.height/2),enemyData);
	     enemySprite.anchor.setTo(0.5);

	     game.physics.arcade.enable(enemySprite);
	     
	     // enemySprite.body.velocity.y = 250;
	     enemySprite.body.velocity.x = -120;

	     // enemySprite.body.bounce.y = 1;
	     // enemySprite.body.bounce.x = 1;
	     // enemySprite.body.angle = game.rnd.integerInRange(0,1);
	     // enemySprite.body.collideWorldBounds = true;
	}

	function updateScore(){
		if (!dead) scoreText.setText(++score);
	}

	function enemyCollide(player,enemy){
	   enemy.kill();
	   MyGame.EXPLOSION.play();
	   // console.log(el1,el2);
	   var explosion = game.add.sprite(0, 0, 'kaboom');
	   explosion.anchor.set(0.5);
	   explosion.reset(enemy.body.x, enemy.body.y);
	   explosion.animations.add('boom');
	   explosion.play('boom', 48, false, true);

	   dead = true;
	   scoreText.alpha = 1;
	   // scoreText.parent.bringToTop(scoreText);
	   menuGroup.alpha = 1;
	   var menuTween = game.add.tween(menuGroup).to({
	        y: -180     
	   }, 500, Phaser.Easing.Bounce.Out, true);

	  // game.camera.follow(null);
	  // game.add.tween(game.camera).to( { x: 0 }, score*500, 'Quart.easeOut').start();
	}
	
	return MyGame.GameRastro;
});
