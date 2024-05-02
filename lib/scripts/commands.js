import { world } from "@minecraft/server";
import * as config from "./config";
export function processCustomCommands(messageComponents, player) {
    if (messageComponents.length == 0)
        return;
    switch (messageComponents[0]) {
        case "!tp": {
            if (!config.WorldConfigs.TP_ENABLE)
                return;
            if (messageComponents.length != 2) {
                player.sendMessage(`tp > 사용법 '!tp <playername>'`);
                return;
            }
            for (let target of world.getAllPlayers()) {
                if (target.name == messageComponents[1]) {
                    let tpSuccess = player.tryTeleport(target.location, { dimension: target.dimension });
                    if (tpSuccess) {
                        player.sendMessage(`tp > ${target.name}에게 소환되었습니다.`);
                        player.addLevels(-config.WorldConfigs.TP_CLEAR_LEVELS_AMOUNT);
                    }
                    else {
                        player.sendMessage(`tp > ${target.name}는 현재 소환할 수 있는 위치가 아닙니다.`);
                    }
                    return;
                }
            }
            player.sendMessage(`tp > 이름 ${messageComponents[1]}은 유효하지 않습니다.`);
            sendPlayerListMessage(player);
            return;
        }
        case "!sethome": {
            if (!config.WorldConfigs.HOME_ENABLE)
                return;
            if (player.dimension.id != "minecraft:overworld") {
                player.sendMessage(`sethome > 홈 설정은 오버월드에서만 가능합니다.`);
                return;
            }
            if (!player.isOp) {
                player.sendMessage(`sethome > 홈 설정은 Operator권한을 가진 사용자만 가능합니다.`);
            }
            let hlScoreboard = world.scoreboard.getObjective(config.HOME_LOCATION_SCOREBOARD);
            // Initialize scoreboards if not present.
            if (!hlScoreboard) {
                hlScoreboard = world.scoreboard.addObjective(config.HOME_LOCATION_SCOREBOARD, "Home-Location");
            }
            hlScoreboard.setScore("x", player.location.x);
            hlScoreboard.setScore("y", player.location.y);
            hlScoreboard.setScore("z", player.location.z);
            player.sendMessage(`sethome > 성공!`);
            return;
        }
        case "!home": {
            if (!config.WorldConfigs.HOME_ENABLE)
                return;
            let hlScoreboard = world.scoreboard.getObjective(config.HOME_LOCATION_SCOREBOARD);
            if (!hlScoreboard) {
                player.sendMessage(`home > 집 위치가 설정되지 않았습니다.`);
                return;
            }
            let px = hlScoreboard.getScore("x");
            let py = hlScoreboard.getScore("y");
            let pz = hlScoreboard.getScore("z");
            if (px != undefined && py != undefined && pz != undefined) {
                let tpSuccess = player.tryTeleport({ x: px, y: py, z: pz }, { dimension: world.getDimension("minecraft:overworld") });
                if (tpSuccess) {
                    player.addLevels(-config.WorldConfigs.TP_CLEAR_LEVELS_AMOUNT);
                    player.sendMessage(`home > 집으로 소환되었습니다.`);
                }
                else {
                    player.sendMessage(`home > 집은 현재 소환할 수 있는 위치가 아닙니다.`);
                }
                return;
            }
            player.sendMessage(`home > 오류`);
            return;
        }
        case "!restart": {
            if (!player.isOp) {
                player.sendMessage(`restart > Operator권한을 가진 사용자만 가능합니다.`);
            }
            if (messageComponents.length == 2 && messageComponents[1] == "default") {
                player.sendMessage(`restart default > 월드 변수가 초기화되었습니다.`);
                world.scoreboard.removeObjective(config.WORLD_CONFIG_SCOREBOARD);
            }
            restartScript();
        }
    }
}
export function restartScript() {
    world.sendMessage(`server > 재시작합니다.`);
    let wcScoreboard = world.scoreboard.getObjective(config.WORLD_CONFIG_SCOREBOARD);
    // Initialize scoreboards if not present.
    if (!wcScoreboard) {
        wcScoreboard = world.scoreboard.addObjective(config.WORLD_CONFIG_SCOREBOARD, "World-Configs");
        for (let s in config.WorldConfigs) {
            wcScoreboard.setScore(s, config.WorldConfigs[s]);
        }
    }
    else {
        for (let s of wcScoreboard.getScores()) {
            let n = s.participant.displayName;
            if (n in config.WorldConfigs) {
                config.WorldConfigs[n] = s.score;
                world.sendMessage(`server > WorldConfigs set ${n} to ${s.score}.`);
            }
        }
    }
}
function sendPlayerListMessage(player) {
    player.sendMessage("접속중인 사용자:");
    world.getAllPlayers().forEach((target) => {
        player.sendMessage("    " + target.name);
    });
}
//# sourceMappingURL=commands.js.map