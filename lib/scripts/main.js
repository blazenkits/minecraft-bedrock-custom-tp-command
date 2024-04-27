import { world, system } from "@minecraft/server";
import { version_documentation } from "./maintenance";
// Globals
const BP_VERSION = 0;
const START_TICK = 100;
const VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
const SERVER_NAME = "재밌는 마크 서버";
// Entry Points
system.run(mainSetup);
world.afterEvents.chatSend.subscribe(onPlayerChatSend);
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
let initCounter = 0;
// Setup Function
function mainSetup() {
    if (initCounter < START_TICK) {
        initCounter++;
        system.run(mainSetup);
        return;
    }
}
// Player Spawn Hook
function onPlayerSpawn(eventData) {
    if (!eventData.initialSpawn) {
        return;
    }
    eventData.player.sendMessage(`${eventData.player.name}님, ${SERVER_NAME}에 접속한 것을 환영합니다!`);
    eventData.player.sendMessage(`현재시간은 ${world.getDay()}일 ${Math.floor(world.getTimeOfDay() / 1000)}시 ${Math.floor((world.getTimeOfDay() % 1000) / 1000 * 60)}분 입니다.`);
    let joinedString = world.getAllPlayers().map(player => player.name).join(', ');
    eventData.player.sendMessage("현재 접속자는 " + joinedString + "입니다.");
    let vcScoreboard = world.scoreboard.getObjective(VERSION_CHECK_SCOREBOARD);
    // Initialize scoreboards if not present.
    if (!vcScoreboard) {
        vcScoreboard = world.scoreboard.addObjective(VERSION_CHECK_SCOREBOARD, "Player-Versions");
    }
    // Add player if not present.
    let is_newbie = false;
    let is_version_upgrade = false;
    if (!vcScoreboard.hasParticipant(eventData.player)) {
        is_newbie = true;
        is_version_upgrade = true;
    }
    else {
        var s = vcScoreboard.getScore(eventData.player);
        if (s != undefined && s != BP_VERSION) {
            is_version_upgrade = true;
        }
    }
    vcScoreboard.setScore(eventData.player, BP_VERSION);
    if (is_version_upgrade && (BP_VERSION in version_documentation)) {
        eventData.player.sendMessage(`데이터팩 버전 1.0.${BP_VERSION}에 추가된 기능들: `);
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
                player.sendMessage(`tp > 사용법 '!tp <playername>'`);
                player.sendMessage("접속중인 사용자:");
                world.getAllPlayers().forEach(target => {
                    player.sendMessage("    " + target.name);
                });
                return;
            }
            for (let target of world.getAllPlayers()) {
                if (target.name == messageComponents[1]) {
                    let tpSuccess = player.tryTeleport(target.location, { dimension: target.dimension });
                    if (tpSuccess) {
                        player.sendMessage(`tp > ${target.name}에게 소환되었습니다.`);
                    }
                    else {
                        player.sendMessage(`tp > ${target.name}는 현재 소환할 수 있는 위치가 아닙니다.`);
                    }
                    return;
                }
            }
            player.sendMessage(`tp > 이름 ${messageComponents[1]}은 유효하지 않습니다.`);
            player.sendMessage("접속중인 사용자:");
            world.getAllPlayers().forEach(target => {
                player.sendMessage("    " + target.name);
            });
        }
    }
}
//# sourceMappingURL=main.js.map