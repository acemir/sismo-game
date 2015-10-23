define(['Phaser','MyGame'], function(Phaser, MyGame) {
    'use strict';

   // Create the object for webfont.js to use.
    // window.WebFontConfig = {
    //     active: function() {
    //         MyGame.Init.prototype.fontLoaded = true;
    //     },
    //     google: {
    //         families: ['Walter Turncoat']
    //     }
    // };

    // This state loads the assets for the loading bar and sets
    // some options, then loads the game state that preloads game assets.

    MyGame.viewportSize = viewport();
    MyGame.viewportDPR = window.devicePixelRatio || 1;

    MyGame.Init = function(game) {};

    MyGame.Init.prototype = {
        init: init,
        preload: preload,
        update: update,
        enterIncorrectOrientation: enterIncorrectOrientation,
        leaveIncorrectOrientation: leaveIncorrectOrientation
    };

    function init() {
        // Set to single pointer input.
        this.input.maxPointers = 1;
        // Uncomment to disable automatic pause when game loses focus.
        //this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.setMinMax(400, 300, 800, 600); // Adjust to your game dimensions
        this.scale.setScreenSize = true;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.stage.backgroundColor = '#020028';

        if (!this.game.device.desktop) {
            this.scale.forceOrientation(true, false); // Landscape
            //this.scale.forceOrientation(false, true); // Portrait
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
        this.scale.refresh();
    }

    function preload() {
        // Load the webfont script for custom fonts
        // this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');

        // Load images for use in Loader state.
        this.load.image('loadingBar', 'media/images/loading-bar.png');
        this.load.image('loadingBarBg', 'media/images/loading-bar-bg.png');

    }

    function update() {
        // Go straight to Loader state after font loads.
        // if (this.fontLoaded) {
            this.state.start('Loader');
        // }
    }

    function enterIncorrectOrientation() {
        MyGame.isOriented = false;
        // Show something to the user to have them re-orient.
    }

    function leaveIncorrectOrientation() {
        MyGame.isOriented = true;
        // Get back to the game!
    }

    function viewport(){
        var e = window;
        var a = 'inner';
        if (!('innerWidth' in window)){
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
    }

    MyGame.LoadingBar = function(game, parent) {
        Phaser.Group.call(this, game, parent);

        // Images loaded by MyGame.Init
        this.background = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBarBg');
        this.background.anchor.setTo(0.5, 0.5);
        this.add(this.background);

        // Left to right loading bar
        this.bar = game.add.sprite(game.world.centerX - 175, game.world.centerY - 16, 'loadingBar');
        // Center to outsides loading bar.
        //this.bar = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBar');
        //this.bar.anchor.setTo(0.5, 0.5);
        this.add(this.bar);
    };

    MyGame.LoadingBar.prototype = Object.create(Phaser.Group.prototype);
    MyGame.LoadingBar.prototype.constructor = MyGame.LoadingBar;

    return MyGame.Init;
});
