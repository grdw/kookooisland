Battle.prototype = {
    start: function() {
        this.initialize();
        window.currentBattle = this;
    },

    stop: function() {
        this.clear();
        window.currentBattle = null;
        delete window.currentBattle;
    },

    pause: function() {
        this.controls.lock.bind(this)();
        this.controls.disable.bind(this)();
        this.enemy.quitAttacking();
    },

    initialize: function() {
        window.currentGame.player.prepareForBattle();
        this.graphic.fill.bind(this)();
        this.battlePopup.show();
        this.controls.unlock.bind(this)();
        this.controls.enable.bind(this)();
        this.enemy.startAttacking();
        this.startCallback();
    },

    clear: function() {
        this.graphic.unfill.bind(this)();
        this.controls.disable.bind(this)();
        this.eventEngine.clear();
        this.enemy.quitAttacking();
        this.enemy.restoreHealth();
        this.endCallback();
    },

    canBattle: function() {
        return window.GameData.player.hp[0] > 0;
    },

    controls: {
        lock: function() {
            this.battleControls.lock();
        },

        unlock: function() {
            this.battleControls.unlock();
        },

        enable: function() {
            window.currentGame.player.attackBar.resetBar(
                this.battleControls.enable.bind(this.battleControls)
            );
        },

        disable: function() {
            this.battleControls.removePlayerAttackListeners();
        }
    },

    graphic: {
        fill: function() {
            this.enemy.spawn();
            window.currentGame.player.spawn();
        },

        unfill: function() {
            this.enemy.unspawn();
            window.currentGame.player.unspawn();
        }
    }
}

function Battle(enemy, startCallback, endCallback) {
    this.enemy = enemy;
    this.startCallback = startCallback || function() {};
    this.endCallback = endCallback || function() {};
    this.battleControls = new BattleControls(this.enemy);
    this.eventEngine = new BattleEventEngine();
    this.battlePopup = new Popup("battle-sequence-popup", undefined, this.stop.bind(this));
}