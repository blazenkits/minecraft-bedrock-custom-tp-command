// scripts/main.ts
import { world, system, Player, EntityComponentTypes, BlockVolume, BlockComponentTypes, ItemStack, EquipmentSlot } from "@minecraft/server";

// scripts/maintenance.ts
var BP_VERSION = 3;
var version_documentation = {
  0: ["!tp <\uC0AC\uC6A9\uC790 \uC774\uB984> -> \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC21C\uAC04\uC774\uB3D9\uD568."],
  1: ["!home -> \uC9D1\uC73C\uB85C tp"],
  2: ["\uC774\uC81C \uC0AC\uB9DD\uC2DC \uC544\uC774\uD15C\uC774 \uC8FD\uC740 \uC704\uCE58\uC758 \uC0C1\uC790\uB85C \uC774\uB3D9\uB429\uB2C8\uB2E4. \uB2E8 \uC544\uC774\uD15C\uC774 \uB108\uBB34 \uB9CE\uC740 \uACBD\uC6B0 \uADF8\uB300\uB85C \uB5A8\uC5B4\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4."],
  3: ["\uC6A9\uC554\uC5D0\uC11C \uC0AC\uB9DD\uC2DC \uC0C1\uC790\uAC00 \uC6A9\uC554 \uC544\uB798\uC5D0 \uC0DD\uC131\uB418\uB294 \uBC84\uADF8 \uC218\uC815"]
};

// scripts/main.ts
var VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
var HOME_LOCATION_SCOREBOARD = "HOME_LOCATION_SCOREBOARD";
var SERVER_NAME = "\uC11C\uBC84";
var ticks = 1;
var groundedPositionMap = {};
mainLoop();
world.afterEvents.chatSend.subscribe(onPlayerChatSend);
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
world.afterEvents.entityDie.subscribe(onEntityDie);
function mainLoop() {
  ticks = (ticks + 1) % 20;
  if (ticks == 0) {
    checkPlayersLastGroundedPosition();
  }
  system.run(mainLoop);
}
function onPlayerSpawn(eventData) {
  if (!eventData.initialSpawn) {
    return;
  }
  eventData.player.sendMessage(`${eventData.player.name}, ${SERVER_NAME}\uC5D0 \uC811\uC18D\uD55C \uAC83\uC744 \uD658\uC601\uD569\uB2C8\uB2E4!`);
  eventData.player.sendMessage(`\uD604\uC7AC\uC2DC\uAC04\uC740 ${world.getDay()}\uC77C ${Math.floor(world.getTimeOfDay() / 1e3)}\uC2DC ${Math.floor(world.getTimeOfDay() % 1e3 / 1e3 * 60)}\uBD84 \uC785\uB2C8\uB2E4.`);
  let joinedString = world.getAllPlayers().map((player) => player.name).join(", ");
  eventData.player.sendMessage("\uD604\uC7AC \uC811\uC18D\uC790\uB294 " + joinedString + "\uC785\uB2C8\uB2E4.");
  let vcScoreboard = world.scoreboard.getObjective(VERSION_CHECK_SCOREBOARD);
  if (!vcScoreboard) {
    vcScoreboard = world.scoreboard.addObjective(VERSION_CHECK_SCOREBOARD, "Player-Versions");
  }
  let is_newbie = false;
  let is_version_upgrade = false;
  if (!vcScoreboard.hasParticipant(eventData.player)) {
    is_newbie = true;
    is_version_upgrade = true;
  } else {
    var s = vcScoreboard.getScore(eventData.player);
    if (s != void 0 && s != BP_VERSION) {
      is_version_upgrade = true;
    }
  }
  vcScoreboard.setScore(eventData.player, BP_VERSION);
  if (is_version_upgrade) {
    eventData.player.sendMessage(`====================================`);
    eventData.player.sendMessage(`\uC11C\uBC84\uAC00 \uC5C5\uB370\uC774\uD2B8\uB418\uC5C8\uC2B5\uB2C8\uB2E4. (-> ${BP_VERSION})`);
    if (BP_VERSION in version_documentation) {
      eventData.player.sendMessage(`\uCD94\uAC00 \uB0B4\uC6A9:`);
      for (let message of version_documentation[BP_VERSION]) {
        eventData.player.sendMessage("    " + message);
      }
    }
  }
  eventData.player.sendMessage(`====================================`);
}
function onPlayerChatSend(eventData) {
  let player = eventData.sender;
  let messageComponents = eventData.message.split(" ");
  if (messageComponents.length == 0)
    return;
  switch (messageComponents[0]) {
    case "!tp": {
      if (messageComponents.length != 2) {
        player.sendMessage(`tp > \uC0AC\uC6A9\uBC95 '!tp <playername>'`);
        player.sendMessage("\uC811\uC18D\uC911\uC778 \uC0AC\uC6A9\uC790:");
        world.getAllPlayers().forEach((target) => {
          player.sendMessage("    " + target.name);
        });
        return;
      }
      for (let target of world.getAllPlayers()) {
        if (target.name == messageComponents[1]) {
          let tpSuccess = player.tryTeleport(target.location, { dimension: target.dimension });
          if (tpSuccess) {
            player.sendMessage(`tp > ${target.name}\uC5D0\uAC8C \uC18C\uD658\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
            player.resetLevel();
          } else {
            player.sendMessage(`tp > ${target.name}\uB294 \uD604\uC7AC \uC18C\uD658\uD560 \uC218 \uC788\uB294 \uC704\uCE58\uAC00 \uC544\uB2D9\uB2C8\uB2E4.`);
          }
          return;
        }
      }
      player.sendMessage(`tp > \uC774\uB984 ${messageComponents[1]}\uC740 \uC720\uD6A8\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.`);
      player.sendMessage("\uC811\uC18D\uC911\uC778 \uC0AC\uC6A9\uC790:");
      world.getAllPlayers().forEach((target) => {
        player.sendMessage("    " + target.name);
      });
      return;
    }
    case "!sethome": {
      if (player.dimension.id != "minecraft:overworld") {
        player.sendMessage(`sethome > \uD648 \uC124\uC815\uC740 \uC624\uBC84\uC6D4\uB4DC\uC5D0\uC11C\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4.`);
        return;
      }
      let hlScoreboard = world.scoreboard.getObjective(HOME_LOCATION_SCOREBOARD);
      if (!hlScoreboard) {
        hlScoreboard = world.scoreboard.addObjective(HOME_LOCATION_SCOREBOARD, "Home-Location");
      }
      hlScoreboard.setScore("x", player.location.x);
      hlScoreboard.setScore("y", player.location.y);
      hlScoreboard.setScore("z", player.location.z);
      player.sendMessage(`sethome > \uC131\uACF5!`);
      return;
    }
    case "!home": {
      let hlScoreboard = world.scoreboard.getObjective(HOME_LOCATION_SCOREBOARD);
      if (!hlScoreboard) {
        player.sendMessage(`home > \uC9D1 \uC704\uCE58\uAC00 \uC124\uC815\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.`);
        return;
      }
      let px = hlScoreboard.getScore("x");
      let py = hlScoreboard.getScore("y");
      let pz = hlScoreboard.getScore("z");
      if (px != void 0 && py != void 0 && pz != void 0) {
        let tpSuccess = player.tryTeleport({ x: px, y: py, z: pz }, { dimension: world.getDimension("minecraft:overworld") });
        if (tpSuccess) {
          player.resetLevel();
          player.sendMessage(`home > \uC9D1\uC73C\uB85C \uC18C\uD658\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`);
        } else {
          player.sendMessage(`home > \uC9D1\uC740 \uD604\uC7AC \uC18C\uD658\uD560 \uC218 \uC788\uB294 \uC704\uCE58\uAC00 \uC544\uB2D9\uB2C8\uB2E4.`);
        }
        return;
      }
      player.sendMessage(`home > \uC624\uB958`);
      return;
    }
  }
}
function onEntityDie(eventData) {
  let e = eventData.deadEntity;
  if (e instanceof Player) {
    let inventory = e.getComponent(EntityComponentTypes.Inventory);
    let equipment = e.getComponent(EntityComponentTypes.Equippable);
    let pos = void 0;
    if (inventory && equipment) {
      if (!(e.id in groundedPositionMap)) {
        e.sendMessage("\uC11C\uBC84 > \uC5D0\uB7EC\uB85C \uC778\uD574 \uC544\uC774\uD15C\uC774 \uC720\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694");
        return;
      }
      pos = { x: groundedPositionMap[e.id].x, y: groundedPositionMap[e.id].y, z: groundedPositionMap[e.id].z };
      console.log(pos.x, pos.y, pos.z);
      e.dimension.setBlockType(pos, "minecraft:chest");
      if (pos) {
        console.log(1);
        let chest = e.dimension.getBlock(pos);
        let chestContainer = chest?.getComponent(BlockComponentTypes.Inventory)?.container;
        let size = inventory.container?.size;
        if (chestContainer && size) {
          console.log(2);
          for (let slot of [EquipmentSlot.Chest, EquipmentSlot.Feet, EquipmentSlot.Head, EquipmentSlot.Legs, EquipmentSlot.Mainhand, EquipmentSlot.Offhand]) {
            let eq = equipment.getEquipment(slot);
            if (eq) {
              let success = chestContainer.addItem(eq);
              if (success instanceof ItemStack) {
                e.dimension.spawnItem(success, { x: pos.x, y: pos.y + 1, z: pos.z });
              }
            }
            equipment.setEquipment(slot, void 0);
          }
          for (let i = 0; i < size; i++) {
            let success = inventory.container?.transferItem(i, chestContainer);
            if (success instanceof ItemStack) {
              e.dimension.spawnItem(success, { x: pos.x, y: pos.y + 1, z: pos.z });
            }
          }
          inventory.container?.clearAll();
          let is = new ItemStack("minecraft:paper", 1);
          is.nameTag = `\uC0AC\uB9DD \uC704\uCE58: ${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`;
          inventory.container?.addItem(is);
        }
      }
    }
  }
}
function checkPlayersLastGroundedPosition() {
  for (let i of world.getAllPlayers()) {
    if (i.isOnGround && !i.dimension.getBlock(i.getHeadLocation())?.isLiquid) {
      try {
        groundedPositionMap[i.id] = { x: i.location.x, y: i.location.y, z: i.location.z };
      } catch (e) {
        console.log(e);
      }
    }
  }
}

//# sourceMappingURL=../debug/main.js.map
