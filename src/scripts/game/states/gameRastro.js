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
    	r = 0;

    MyGame.GameRastro = function(game) {};

	MyGame.GameRastro.prototype = {
	  create: function(){

	    score = 0;
	    dead = false;
	  	game = this.game;
	    
	    waveW = Math.min(game.width, game.height)/2;
	    wavesData = game.add.bitmapData(waveW,waveW);
	    waves = new SineWaves({
	      el: wavesData,
	      
	      speed: 7.5,

	      running: false,
	      
	      width: waveW,
	      
	      height: waveW,
	      
	      ease: 'SineInOut',

	      rotate: 0,
	      
	      wavesWidth: '125%',
	      
	      waves: [
	        {
	          timeModifier: 0,
	          lineWidth: 2,
	          amplitude: -160,
	          wavelength: 100
	        }
	      ],
	     
	      // Resize
	      resizeEvent: function() {
	        // var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
	        // gradient.addColorStop(0,'rgba(255,255,255,1)');
	        
	        // var index = -1;
	        // var length = this.waves.length;
	        // while(++index < length){
	        //   this.waves[index].strokeStyle = gradient;
	        // }
	        
	        // // Clean Up
	        // index = void 0;
	        // length = void 0;
	        // gradient = void 0;
	      }
	    });


	    game.world.setBounds(0, 0, 20000, game.height);


	    playerData = game.add.bitmapData(4,4);
	    playerData.circle(2,2,2, '#FFFFFF');

	    // ENEMY
		scoreText = game.add.text(game.width/2,game.height/2,score,{
		   font:'bold 400px Arial',
		   fill: '#acacac',
		   align: 'center', boundsAlignH: 'center', boundsAlignV: 'middle'
		});
		scoreText.alpha = .1;
		scoreText.fixedToCamera = true;
		scoreText.anchor.setTo(0.5);

		// ENEMY
	    enemyGroup = game.add.group();
	    
	    // TRAILS
		trail = game.add.graphics(0,0);
		trail1 = game.add.graphics(0,0);
		trail2 = game.add.graphics(0,0);

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

	    game.input.touch.touchStartCallback = function(event){
	    	touchAmmount = event.touches[0].clientX;
	    };	    

	    game.input.touch.touchMoveCallback = function(event){
	    	var ammount = -(touchAmmount - event.touches[0].clientX);
	    	var rot = r + ammount > 360 ? r + ammount - 360 : r + ammount < 0 ? r + ammount + 360 : r + ammount;
	    	waveGroup.angle = rot;    
	    };

	    game.input.touch.touchEndCallback = function(event){
	    	r = waveGroup.angle;
	    };

	    game.input.mouse.mouseDownCallback = function(event){
	    	touchAmmount = event.clientX;
	    };

	    game.input.mouse.mouseUpCallback = function(event){
	    	r = waveGroup.angle;
	    };

		game.input.addMoveCallback(function(pointer, x, y) {
		  if (pointer.isMouse && pointer.isDown) {
	    	var ammount = -(touchAmmount - event.clientX);
	    	var rot = r + ammount > 360 ? r + ammount - 360 : r + ammount < 0 ? r + ammount + 360 : r + ammount;
	    	waveGroup.angle = rot;
		  }
		});

          menuGroup = game.add.group();
          menuGroup.alpha = 0;
          
          // var menuButton = game.add.button(game.width / 2, game.height - 30, 'menubutton', toggleMenu);
          // menuButton.anchor.set(0.5);
          // menuGroup.add(menuButton);
          
          var resetGame = game.add.button(game.width / 2, game.height + 80, 'resetgame', function(){
               game.state.start('GameRastro');
          });
          resetGame.anchor.set(0.5);
          resetGame.fixedToCamera = true;
          menuGroup.add(resetGame);
          
          var thankYou = game.add.button(game.width / 2, game.height + 140, 'thankyou', function(){
          	game.state.start('GameTitle');
          });
          thankYou.anchor.set(0.5);
          thankYou.fixedToCamera = true;
          menuGroup.add(thankYou);

          trail.lineStyle(2, 0x0000FF, 1);
          trail.moveTo(playerSprite.world.x,playerSprite.world.y);

          trail1.lineStyle(2, 0x00FF00, 1);
          trail1.moveTo(playerSpriteLeft.world.x,playerSpriteLeft.world.y);

          trail2.lineStyle(2, 0x00FFFF, 1);
          trail2.moveTo(playerSpriteRight.world.x,playerSpriteRight.world.y);

          trail.alpha = 0;
          trail1.alpha = 0;
          trail2.alpha = 0;

          game.time.events.add(Phaser.Timer.SECOND * .5, function(){

            trail.clear();
            trail.lineStyle(2, 0x0000FF, 1);

            trail1.clear();
            trail1.lineStyle(2, 0x00FF00, 1);

            trail2.clear();
            trail2.lineStyle(2, 0x00FFFF, 1);

            game.add.tween(trail).to({
              alpha: 1    
            }, 2000, Phaser.Easing.Default, true);
            game.add.tween(trail1).to({
              alpha: 1    
            }, 2000, Phaser.Easing.Default, true);
            game.add.tween(trail2).to({
              alpha: 1    
            }, 2000, Phaser.Easing.Default, true);


          }, this).autoDestroy = true;


          game.camera.follow(waveGroup);

          game.time.events.loop(Phaser.Timer.SECOND, updateScore, this);

	  },
	  update: function(){


          game.physics.arcade.overlap([playerSprite,playerSpriteLeft,playerSpriteRight], enemyGroup, function(el1,el2){
               // console.log(el1,el2);
               dead = true;
               scoreText.alpha = 1;
               scoreText.parent.bringToTop(scoreText);
               menuGroup.alpha = 1;
               var menuTween = game.add.tween(menuGroup).to({
                    y: -180     
               }, 500, Phaser.Easing.Bounce.Out, true);

              game.camera.follow(null);
              game.add.tween(game.camera).to( { x: 0 }, score*500, 'Quart.easeOut').start();
          },null,this);

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

          waveGroup.body.velocity.x = 120;

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

          trail.lineTo(playerSprite.world.x,playerSprite.world.y);
          trail1.lineTo(playerSpriteLeft.world.x,playerSpriteLeft.world.y);
          trail2.lineTo(playerSpriteRight.world.x,playerSpriteRight.world.y);

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
	     // enemySprite.body.velocity.x = 250;

	     // enemySprite.body.bounce.y = 1;
	     // enemySprite.body.bounce.x = 1;
	     // enemySprite.body.angle = game.rnd.integerInRange(0,1);
	     // enemySprite.body.collideWorldBounds = true;
	}

	function updateScore(){
		if (!dead) scoreText.setText(++score);
	}
	
	return MyGame.GameRastro;
});
