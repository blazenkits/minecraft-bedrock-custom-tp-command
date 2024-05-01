import {
  world,
  system,
  ChatSendAfterEvent,
  PlayerSpawnAfterEvent,
  EntityInventoryComponent,
  EntityDieAfterEvent,
  Player,
  EntityComponentTypes,
  Entity,
  Vector3,
  BlockVolume,
  BlockComponentTypes,
  ItemStack,
  EntityEquippableComponent,
  EquipmentSlot,
  EntitySpawnAfterEvent,
  EntityInitializationCause,
  WorldInitializeAfterEvent,
  World,
} from "@minecraft/server";
import { BP_VERSION, version_documentation } from "./maintenance";
import { processCustomCommands } from "./commands";
import { Vector3Utils } from "@minecraft/math";
import * as config from "./config";
import { WorldConfigs } from "./config";

interface StringVec3Dictionary {
  [key: string]: Vector3;
}

const groundedPositionMap: StringVec3Dictionary = {};

// Setup Hooks
system.run(mainLoop);
world.afterEvents.chatSend.subscribe(onPlayerChatSend);
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
world.afterEvents.entityDie.subscribe(onEntityDie);
world.afterEvents.entitySpawn.subscribe(onEntitySpawn);
world.afterEvents.worldInitialize.subscribe(onWorldInitialize);

function onWorldInitialize(eventData: WorldInitializeAfterEvent){
  let wcScoreboard = world.scoreboard.getObjective(config.WORLD_CONFIG_SCOREBOARD);

  // Initialize scoreboards if not present.
  if (!wcScoreboard) {
    wcScoreboard = world.scoreboard.addObjective(config.WORLD_CONFIG_SCOREBOARD, "World-Configs");
    wcScoreboard.setScore("TP_ENABLE", 1)
    wcScoreboard.setScore("NETHER_ENEMY_SPAWN_INHIBIT_ENABLE", 1)
    wcScoreboard.setScore("NETHER_ENEMY_DEBUF_STRENGTH", 0)
    wcScoreboard.setScore("MOB_SPAWN_INHIBIT_RADIUS", 100)
    wcScoreboard.setScore("DEBUG_LOG", 0)
  } else {
    for(let s of wcScoreboard.getScores()){
      let n = s.participant.displayName
      world.sendMessage('>>' + n)
      if (n in WorldConfigs){
        WorldConfigs[n] = s.score
        world.sendMessage(`Successfully configured WorldConfigs ${n} to ${s.score}.`)
      }
    }
  }

}
// Main Loop
var ticks = 1;
function mainLoop() {
  ticks = (ticks + 1) % 20;
  if (ticks == 0) {
    checkPlayersLastGroundedPosition();
  }
  system.run(mainLoop);
}

// Player Spawn Hook
function onPlayerSpawn(eventData: PlayerSpawnAfterEvent) {
  if (!eventData.initialSpawn) {
    return;
  }
  eventData.player.sendMessage(`${eventData.player.name}, ${config.SERVER_NAME}에 접속한 것을 환영합니다!`);
  eventData.player.sendMessage(
    `현재시간은 ${world.getDay()}일 ${Math.floor(world.getTimeOfDay() / 1000)}시 ${Math.floor(
      ((world.getTimeOfDay() % 1000) / 1000) * 60
    )}분 입니다.`
  );
  let joinedString = world
    .getAllPlayers()
    .map((player) => player.name)
    .join(", ");
  eventData.player.sendMessage("현재 접속자는 " + joinedString + "입니다.");

  let vcScoreboard = world.scoreboard.getObjective(config.VERSION_CHECK_SCOREBOARD);

  // Initialize scoreboards if not present.
  if (!vcScoreboard) {
    vcScoreboard = world.scoreboard.addObjective(config.VERSION_CHECK_SCOREBOARD, "Player-Versions");
  }

  // Add player if not present.
  let is_newbie = false;
  let is_version_upgrade = false;
  if (!vcScoreboard.hasParticipant(eventData.player)) {
    is_newbie = true;
    is_version_upgrade = true;
  } else {
    var s = vcScoreboard.getScore(eventData.player);
    if (s != undefined && s != BP_VERSION) {
      is_version_upgrade = true;
    }
  }
  vcScoreboard.setScore(eventData.player, BP_VERSION);
  if (is_version_upgrade) {
    eventData.player.sendMessage(`====================================`);
    eventData.player.sendMessage(`서버가 업데이트되었습니다. (-> ${BP_VERSION})`);
    if (BP_VERSION in version_documentation) {
      eventData.player.sendMessage(`추가 내용:`);
      for (let message of version_documentation[BP_VERSION]) {
        eventData.player.sendMessage(("    " + message) as string);
      }
    }
  }
  eventData.player.sendMessage(`서버 기능 설명: ${config.README_LINK}`)
  eventData.player.sendMessage(`====================================`);
}

function onPlayerChatSend(eventData: ChatSendAfterEvent) {
  let player = eventData.sender;
  let messageComponents = eventData.message.split(" ");
  processCustomCommands(messageComponents, player);
}

function onEntityDie(eventData: EntityDieAfterEvent) {
  let e = eventData.deadEntity;
  if (e instanceof Player) {
    let inventory = e.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    let equipment = e.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
    let pos = undefined;
    if (!world.gameRules.keepInventory) return;
    if (inventory && equipment) {
      // Find suitable void location in vertical area

      if (!(e.id in groundedPositionMap)) {
        e.sendMessage("서버 > 에러로 인해 아이템이 유지되었습니다. 관리자에게 문의해 주세요");
        return;
      }
      pos = {
        x: groundedPositionMap[e.id].x,
        y: groundedPositionMap[e.id].y,
        z: groundedPositionMap[e.id].z,
      } as Vector3;
      console.log(pos.x, pos.y, pos.z);
      e.dimension.setBlockType(pos, "minecraft:chest");

      if (pos) {
        console.log(1);
        let chest = e.dimension.getBlock(pos);
        let chestContainer = chest?.getComponent(BlockComponentTypes.Inventory)?.container;

        // Success! Actual logic from now on
        let size = inventory.container?.size;

        if (chestContainer && size) {
          console.log(2);
          for (let slot of [
            EquipmentSlot.Chest,
            EquipmentSlot.Feet,
            EquipmentSlot.Head,
            EquipmentSlot.Legs,
            EquipmentSlot.Mainhand,
            EquipmentSlot.Offhand,
          ]) {
            let eq = equipment.getEquipment(slot);
            if (eq) {
              let success = chestContainer.addItem(eq);
              if (success instanceof ItemStack) {
                e.dimension.spawnItem(success, { x: pos.x, y: pos.y + 1, z: pos.z });
              }
            }
            equipment.setEquipment(slot, undefined);
          }

          for (let i = 0; i < size; i++) {
            let success = inventory.container?.transferItem(i, chestContainer);
            if (success instanceof ItemStack) {
              e.dimension.spawnItem(success, { x: pos.x, y: pos.y + 1, z: pos.z });
            }
          }

          inventory.container?.clearAll();
          let is = new ItemStack("minecraft:paper", 1);
          is.nameTag = `사망 위치: ${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`;
          inventory.container?.addItem(is);
        }
      }
    }
  }
}


function onEntitySpawn(eventData: EntitySpawnAfterEvent){
  if (eventData.cause == EntityInitializationCause.Spawned){
    if (eventData.entity.dimension.id == "minecraft:nether" && (config.NETHER_ENEMY_SPAWN_BLACKLIST.indexOf(eventData.entity.typeId) != -1)){
      let hl = getHomeLocation()
      if(hl){ 
        hl = Vector3Utils.scale(hl, 1/8);
        let l = Vector3Utils.distance(eventData.entity.location, hl)
        if(l < WorldConfigs.MOB_SPAWN_INHIBIT_RADIUS){
          dlog(`(onEntitySpawn) Removing nether enemy ${eventData.entity.typeId} (distance ${l} @ ${Vector3Utils.toString(eventData.entity.location, {decimals: 1})})`)
          eventData.entity.remove()
        }
      }
    }
  }
}


function getHomeLocation(): Vector3 | undefined{
  let hlScoreboard = world.scoreboard.getObjective(config.HOME_LOCATION_SCOREBOARD);
  if (!hlScoreboard) return undefined;

  let px = hlScoreboard.getScore("x");
  let py = hlScoreboard.getScore("y");
  let pz = hlScoreboard.getScore("z");
  if (!px || !py || !pz) return undefined;
  return {x: px, y: py, z: pz}
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

function dlog(s : string){
  if (WorldConfigs.DEBUG_LOG)
    world.sendMessage("> (Server Debug): " + s)
}