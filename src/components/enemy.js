import { Bar } from './bar.js';
import { Event, Eventbus } from './eventbus.js';
import EnemyData from '../../data/enemies.yaml';

export const Enemy = (function () {
  Enemy.prototype = {
    spawn: function (method) {
      this.node = document.querySelector(
        '.enemy_' + this.key
      ).cloneNode(true);
      this.node.classList.remove('enemy_' + this.key);

      method.call(this);
    },

    attack: function (battle) {
      const pickAttacks = [];

      for (const i in this.attacks) {
        for (let j = 0; j < this.attacks[i].probability; j++) {
          pickAttacks.push(this.attacks[i]);
        }
      }

      const attack = pickAttacks[
        Math.round(Math.random() * (pickAttacks.length - 1))
      ];

      Eventbus.apply(new Event('enemyTurnPlayed', { battle: battle }));
      battle.turns.add(new Event('enemyAttacked', {
        battle: battle,
        attack: attack
      }));
    },

    takeDamage: function (damage) {
      Eventbus.apply(
        new Event('enemyDamaged', {
          battle: this,
          damage: damage * -1
        })
      );
    },

    die: function () {
      Eventbus.apply(new Event('enemyDied', { battle: this }));
    }
  };

  function Enemy (key) {
    this.key = key;
    Object.assign(this, EnemyData[this.key]);

    this.hpBar = new Bar('enemy.health');
    this.turnBar = new Bar('enemy.attack', { duration: this.turnSpeed });
  }

  return Enemy;
}());
