'use strict';

requirejs.config({
    baseUrl: './scripts',
    paths: {
        almond: 'bower_components/almond/almond',
        Phaser: 'bower_components/phaser/dist/phaser-dist',
        SineWaves: 'game/SineWaves',

        main: 'main',

        MyGame: 'game/MyGame',

        init: 'game/states/init',
        loader: 'game/states/loader',
        gameTitle: 'game/states/gameTitle',
        gameDesvio: 'game/states/gameDesvio',
        gameRastro: 'game/states/gameRastro'
    },
    shim: {
        Phaser: {
            exports: 'Phaser'
        }
    }
});

require(['main']);