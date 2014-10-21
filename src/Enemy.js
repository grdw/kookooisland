Enemy.prototype = {
  startAttacking: function(){
    this.attackHoldBar.resetBar();
    this.attackInterval = setInterval(
      this.attack.bind(this),
      this.enemyInformation.attack_interval
    );
  },

  attack: function(){
    var toPerformAttack = this.pickAttack();
    var self = this;
    window.currentBattle.eventEngine.add({
      message: (this.enemyInformation.name + " attacked with " + toPerformAttack.name),
      perform: function(){
        self.attackWith(toPerformAttack);
      },
      eventTime: 2000
    });
  },

  quitAttacking: function(){
    clearInterval(this.attackInterval);
  },

  pickAttack: function(){
    var attacks = [];
    for(var attack in this.enemyInformation.attacks){
      for(var i = 0; i < this.enemyInformation.attacks[attack].probability; i++){
        attacks.push(this.enemyInformation.attacks[attack]);
      }
    }
    picked_attack = Math.round(Math.random() * (attacks.length - 1));
    return attacks[picked_attack];
  },

  attackWith: function(attack){
    window.currentGame.player.looseHealth(this.calculateAttackDamage(attack));
    this.attackHoldBar.resetBar();
  },

  calculateAttackDamage: function(attack){
    return (attack.damage -
      (attack.damage * window.currentGame.player.armor().damage_reduction));
  },

  getEnemyStats: function(){
    return Enemies[this.identifier];
  },

  looseHealth: function(amount){
    this.enemyInformation.health -= amount;
    if(this.enemyInformation.health <= 0){
      this.enemyInformation.health = 0;

      window.currentBattle.eventEngine.add({
        perform:   this.rewardPlayer.bind(this),
        eventTime: 5000
      });

      window.currentBattle.eventEngine.add({
        type: "end"
      });
    }
    this.healthBar.update(this.enemyInformation.health);
  },

  rewardPlayer: function(){
    var self = this;
    $.each(['experience', 'stats', 'items'], function(i, rewardType){
      if(self.enemyInformation.rewards[rewardType]){
        new Rewarder(rewardType, self.enemyInformation.rewards).reward();
      }
    });
  },

  getGraphic: function(){
    return this.enemyPre.innerHTML;
  },

  setGraphicToBattleField: function(){
    this.enemyPlaceholder  = dom.find("#battle-sequence-popup .field .enemy #graphic");
    this.enemyPlaceholder.innerHTML = this.getGraphic();
  },

  setPosition: function(){
    this.enemyPosition = dom.find("#battle-sequence-popup .field .enemy");
    this.enemyPosition.style.top = this.enemyInformation.position.y + "px";
    this.enemyPosition.style.right = this.enemyInformation.position.x + "px";
  },

  spawn: function(){
    this.setPosition();
    this.setGraphicToBattleField();
  },

  unspawn: function(){
    this.enemyPlaceholder.innerHTML = "";
  }
}

function Enemy(identifier, callbacks){
  this.identifier             = identifier;
  this.callbacks              = callbacks;
  this.enemyPre               = dom.find(".enemies #" + identifier);
  this.enemyInformation       = this.getEnemyStats();
  this.attackHoldBar          = new Bar(".field .enemy .attackbar .attack-left", this.enemyInformation.attack_interval);
  this.healthBar              = new StatBar(".field .enemy", ".health-stats .health-stats-left", ".health-stats .total-health", ".healthbar .health-left");
  this.attackInterval         = null;
  this.healthBar.initialize(this.enemyInformation.health, this.enemyInformation.health);
}
