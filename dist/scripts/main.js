// scripts/main.ts
import { world, system } from "@minecraft/server";

// scripts/maintenance.ts
var version_documentation = {
  0: "    !tp <\uC0AC\uC6A9\uC790 \uC774\uB984> -> \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC21C\uAC04\uC774\uB3D9\uD568."
};

// scripts/main.ts
var BP_VERSION = 0;
var START_TICK = 100;
var VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
var SERVER_NAME = "\uC7AC\uBC0C\uB294 \uB9C8\uD06C \uC11C\uBC84";
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
  eventData.player.sendMessage(`${eventData.player.name}\uB2D8, ${SERVER_NAME}\uC5D0 \uC811\uC18D\uD55C \uAC83\uC744 \uD658\uC601\uD569\uB2C8\uB2E4!`);
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
  if (is_version_upgrade && BP_VERSION in version_documentation) {
    eventData.player.sendMessage(`\uB370\uC774\uD130\uD329 \uBC84\uC804 1.0.${BP_VERSION}\uC5D0 \uCD94\uAC00\uB41C \uAE30\uB2A5\uB4E4: `);
    eventData.player.sendMessage(version_documentation[BP_VERSION]);
  }
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
    }
  }
}

//# sourceMappingURL=../debug/main.js.map
