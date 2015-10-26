'use strict';

require([
    'Phaser',
    'MyGame',
    'init',
    'loader',
    'gameTitle',
    'gameDesvio',
    'gameRastro',
], function(Phaser, MyGame) {

    // Create the Phaser game instance.
    MyGame.game = new Phaser.Game(MyGame.viewportSize.width*MyGame.viewportDPR, MyGame.viewportSize.height*MyGame.viewportDPR, Phaser.CANVAS);

    // Set anything that needs to be accesible across states here.
    MyGame.isOriented = false;

    // Add states.
    MyGame.game.state.add('Init', MyGame.Init, true); // Auto start this state
    MyGame.game.state.add('Loader', MyGame.Loader);
    MyGame.game.state.add('GameTitle', MyGame.GameTitle);
    MyGame.game.state.add('GameDesvio', MyGame.GameDesvio);
    MyGame.game.state.add('GameRastro', MyGame.GameRastro);
    // Add additional states here.

    return MyGame.game;
});
