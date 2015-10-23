define(['Phaser','MyGame'], function(Phaser, MyGame) {
    'use strict';

    // This state loads all the game assets while displaying
    // 'Loading...' text and a loading bar to show progress.
    MyGame.Loader = function(game) {
        this.ready = false;
    };

    MyGame.Loader.prototype = {
        preload: preload,
        create: create,
        update: update
    };

    function preload() {
        var fontStyle = {
            font: '18px Walter Turncoat',
            fill: '#ffffff'
        };

        // A somewhat contrived example of using objects.
        this.loadingBar = new MyGame.LoadingBar(this.game);
        this.load.setPreloadSprite(this.loadingBar.bar);

        // Changing the fontStyle will require adjustment to the location here.
        this.loadingText = this.add.text(this.world.centerX, this.world.centerY - 30, 'Carregando...', fontStyle);
        this.loadingText.anchor.setTo(0.5, 0.5);

        // Make your loading bar any color!
        this.loadingBar.background.tint = 0x7edcfc;
        this.loadingBar.bar.tint = 0x7edcfc;

        // Load assets and game object scripts here.
        this.load.image('gametitle', 'media/sprites/gametitle.png');
        this.load.image('gridedition', 'media/sprites/gridedition.png');
        this.load.image('playbutton', 'media/sprites/playbutton.png');
        this.load.image('menubutton', 'media/sprites/menubutton.png');
        this.load.image('resetgame', 'media/sprites/resetgame.png');
        this.load.image('thankyou', 'media/sprites/thankyou.png');
    }

    function create() {
        this.loadingBar.bar.cropEnabled = false;
    }

    function update() {
        // Make sure audio is decoded before moving on to the next state.
        //if (this.cache.isSoundDecoded('yourAudio') && this.ready === false) {
           this.ready = true;
           this.state.start('GameTitle');
        //}
    }

    return MyGame.Loader;
});
