LoadCallbacks = {
  show_fish: function(){
    Callbacks.seashell.showFish();
  },

  show_bottle: function(){
    Callbacks.seashell.showMessageInABottle();
  },

  show_shark: function(){
    Callbacks.seashell.addShark();
  },

  show_build_bridge_button: function(){
    Callbacks.wood.showBuildBridgeButton();
  },

  show_stat: function(type){
    var stat_elem = document.getElementById(type + "s");
    var statCount = document.getElementById(type + "-count");
    stat_elem.style.display = "inline-block";
    statCount.innerHTML = GameData.player[type + "s"];
  },

  setup_inventory: function(){
    window.Game.player.inventory.checkInventory();
    $.each(window.GameData.player.inventory, function(i, inventoryItem){
      window.Game.player.inventory.addItem(
        new InventoryItem(inventoryItem.itemTitle, inventoryItem.identifier, null);
      );
    });
  },

  enable_build_bridge_button: function(){
    window.Game.gameMap.showBridge();
    window.Game.gameMap.enableSquirrelCity();
  }
}