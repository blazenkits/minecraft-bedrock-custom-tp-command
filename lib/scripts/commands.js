import { world } from "@minecraft/server";
import * as config from "./config";
export function processCustomCommands(messageComponents, player) {
    if (messageComponents.length == 0)
        return;
    switch (messageComponents[0]) {
        case "!tp": {
            if (messageComponents.length != 2) {
                player.sendMessage(`tp > 사용법 '!tp <playername>'`);
                return;
            }
            for (let target of world.getAllPlayers()) {
                if (target.name == messageComponents[1]) {
                    let tpSuccess = player.tryTeleport(target.location, { dimension: target.dimension });
                    if (tpSuccess) {
                        player.sendMessage(`tp > ${target.name}에게 소환되었습니다.`);
                        player.resetLevel();
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
            if (player.dimension.id != "minecraft:overworld") {
                player.sendMessage(`sethome > 홈 설정은 오버월드에서만 가능합니다.`);
                return;
            }
            if (!player.isOp) {
                player.sendMessage(`sethome > 홈 설정은 Operator aaaa권한을 가진 사용자만 가능합니다.`);
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
                    player.resetLevel();
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
    }
}
function sendPlayerListMessage(player) {
    player.sendMessage("접속중인 사용자:");
    world.getAllPlayers().forEach((target) => {
        player.sendMessage("    " + target.name);
    });
}
//# sourceMappingURL=commands.js.map