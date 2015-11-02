define(['Phaser','SineWaves','MyGame'], function(Phaser, SineWaves, MyGame) {
    'use strict';

    MyGame.BG = {};
    MyGame.PLAYER = {};

    // This state loads all the game assets while displaying
    // 'Loading...' text and a loading bar to show progress.
    MyGame.Loader = function() {
        this.ready = false;
    };

    MyGame.Loader.prototype = {
        preload: function() {

            // Configure Background
            MyGame.BG.starfieldData = this.add.bitmapData(this.game.width,this.game.height);
            MyGame.BG.starfield = new MyGame.createStarfield(MyGame.BG.starfieldData);

            // Configure Player Wave
            MyGame.PLAYER.waveW = Math.min(this.game.width, this.game.height)/1.5;
            MyGame.PLAYER.wavesData = this.add.bitmapData(MyGame.PLAYER.waveW,MyGame.PLAYER.waveW);
            MyGame.PLAYER.waves = new SineWaves({
              el: MyGame.PLAYER.wavesData,
              
              speed: 6,

              running: false,
              
              width: MyGame.PLAYER.waveW,
              
              height: MyGame.PLAYER.waveW,
              
              ease: 'SineInOut',

              rotate: 0,
              
              wavesWidth: '125%',
              
              waves: [
                {
                  timeModifier: 0,
                  lineWidth: 2,
                  amplitude: -150,
                  wavelength: 80
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

            this.starfieldSprite = this.add.sprite(0, 0, MyGame.BG.starfieldData);
            this.starfieldSprite.alpha = 0;

            // A somewhat contrived example of using objects.
            this.loadingBar = new MyGame.LoadingBar(this.game);
            this.load.setPreloadSprite(this.loadingBar.bar);

            // Changing the fontStyle will require adjustment to the location here.
            this.loadingText = this.add.text(this.world.centerX, this.world.centerY - 30, 'Carregando...', {
                font: '18px Arial',
                fill: '#ffffff'
            });
            this.loadingText.anchor.setTo(0.5, 0.5);

            // Make your loading bar any color!
            // this.loadingBar.background.tint = 0x7edcfc;
            // this.loadingBar.bar.tint = 0x320126;
            this.loadingBar.bar.anchor.setTo(0.5, 0.5);


            // Load assets and game object scripts here.
            this.load.audio('music', ['media/audio/music.mp3', 'media/audio/music.ogg']);
            this.load.audio('xplosion', ['media/audio/explosion.mp3', 'media/audio/explosion.ogg']);
            this.load.image('gametitle', 'media/sprites/gametitle.png');
            this.load.image('resetgame', 'media/sprites/resetgame.png');
            this.load.image('thankyou', 'media/sprites/thankyou.png');
            this.load.spritesheet('kaboom', 'media/sprites/Exp_type_C_pixel_opt.png', 256, 256, 48);

            MyGame.BG.starfield.go();

        },
        create: function() {
            MyGame.BG.starfield.run();
            this.loadingBar.bar.cropEnabled = false;
        }, 
        update: function() {
            MyGame.BG.starfield.run();
            // Make sure audio is decoded before moving on to the next state.
            if (this.cache.isSoundDecoded('music') && this.ready === false) {
               this.ready = true;

               MyGame.MUSIC = this.add.audio('music',1,true);
               MyGame.EXPLOSION = this.add.audio('xplosion',0.5);
               MyGame.MUSIC.play();

                this.add.tween(this.loadingBar.bar).to({
                  alpha: 0    
                }, 500, Phaser.Easing.Default, true);

                this.add.tween(this.loadingText).to({
                  alpha: 0    
                }, 500, Phaser.Easing.Default, true);


                this.add.tween(this.starfieldSprite).to({
                  alpha: 1    
                }, 1000, Phaser.Easing.Linear.None, true).onComplete.add(function(){
                    this.state.start('GameTitle');
                }, this);
            }
        }
    };

    return MyGame.Loader;
});
