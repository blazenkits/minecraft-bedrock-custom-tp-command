// scripts/main.ts
import { world, system } from "@minecraft/server";

// scripts/maintenance.ts
var version_documentation = {
  0: ["!tp <\uC0AC\uC6A9\uC790 \uC774\uB984> -> \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC21C\uAC04\uC774\uB3D9\uD568."],
  1: ["!home -> \uC9D1\uC73C\uB85C tp"]
};

// scripts/main.ts
var BP_VERSION = 1;
var START_TICK = 100;
var VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
var HOME_LOCATION_SCOREBOARD = "HOME_LOCATION_SCOREBOARD";
var SERVER_NAME = "\uC11C\uBC84";
system.run(mainSetup);
world.afterEvents.chatSend.subscribe(onPlayerChatSend);
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
var initCounter = 0;
function mainSetup() {
  if (initCounter < START_TICK) {
    initCounter++;
    system.run(mainSetup);
    return;
  }
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

//# sourceMappingURL=../debug/main.js.map
