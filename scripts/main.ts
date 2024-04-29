import { world, system, ChatSendAfterEvent, PlayerJoinAfterEvent, PlayerSpawnAfterEvent, EntityInventoryComponent, EntityDieAfterEvent, Player, EntityComponentTypes, Entity, Vector3, BlockVolume, BlockVolumeBase, BlockComponent, BlockComponentTypes, BlockType, BlockTypes, ItemStack, EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { BP_VERSION, version_documentation } from "./maintenance";

const VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD"
const HOME_LOCATION_SCOREBOARD = "HOME_LOCATION_SCOREBOARD"
const SERVER_NAME = "서버"
var ticks = 1

interface StringVec3Dictionary {
  [key: string]: Vector3;
}
const groundedPositionMap : StringVec3Dictionary = {}


// Entry Points
mainLoop();
world.afterEvents.chatSend.subscribe(onPlayerChatSend)
world.afterEvents.playerSpawn.subscribe(onPlayerSpawn)
world.afterEvents.entityDie.subscribe(onEntityDie)
let initCounter = 0


// Setup Function
function mainLoop() {  
  ticks = (ticks + 1) % 20
  if (ticks == 0){
    checkPlayersLastGroundedPosition()
  }
  system.run(mainLoop);
  
}

// Player Spawn Hook
function onPlayerSpawn(eventData: PlayerSpawnAfterEvent){
  if (!eventData.initialSpawn) {return;}
  eventData.player.sendMessage(`${eventData.player.name}, ${SERVER_NAME}에 접속한 것을 환영합니다!`)
  eventData.player.sendMessage(`현재시간은 ${world.getDay()}일 ${Math.floor(world.getTimeOfDay()/ 1000)}시 ${Math.floor((world.getTimeOfDay() % 1000) / 1000 * 60)}분 입니다.`)
  let joinedString = world.getAllPlayers().map(player => player.name).join(', ');
  eventData.player.sendMessage("현재 접속자는 " + joinedString +"입니다.");
    
  let vcScoreboard = world.scoreboard.getObjective(VERSION_CHECK_SCOREBOARD)
  
  // Initialize scoreboards if not present.
  if (!vcScoreboard){
    vcScoreboard = world.scoreboard.addObjective(VERSION_CHECK_SCOREBOARD, "Player-Versions")
  }

  // Add player if not present.
  let is_newbie = false
  let is_version_upgrade = false
  if (!vcScoreboard.hasParticipant(eventData.player)){
    is_newbie = true
    is_version_upgrade = true
  } else {
    var s = vcScoreboard.getScore(eventData.player) 
    if (s != undefined && s != BP_VERSION){
      is_version_upgrade = true
    }
  }
  vcScoreboard.setScore(eventData.player, BP_VERSION)
  if (is_version_upgrade){
    eventData.player.sendMessage(`====================================`)
    eventData.player.sendMessage(`서버가 업데이트되었습니다. (-> ${BP_VERSION})`)
    if(BP_VERSION in version_documentation){
      eventData.player.sendMessage(`추가 내용:`)
      for (let message of version_documentation[BP_VERSION]){
        eventData.player.sendMessage("    " + message as string)
      }
    }
  }
  eventData.player.sendMessage(`====================================`)
}

function onPlayerChatSend(eventData: ChatSendAfterEvent){
  
  let player = eventData.sender
  let messageComponents = eventData.message.split(" ")

  if (messageComponents.length == 0) return
  switch (messageComponents[0]){
  
    case "!tp": {
      if (messageComponents.length != 2){
        player.sendMessage(`tp > 사용법 '!tp <playername>'`)
        player.sendMessage("접속중인 사용자:")
        world.getAllPlayers().forEach(target => {
          player.sendMessage("    " + target.name);
        });
        return
      }
      for (let target of world.getAllPlayers()) {
        if (target.name == messageComponents[1]){
          let tpSuccess = player.tryTeleport(target.location, {dimension: target.dimension})
          if (tpSuccess){
            player.sendMessage(`tp > ${target.name}에게 소환되었습니다.`)
            player.resetLevel()
          } else {
            player.sendMessage(`tp > ${target.name}는 현재 소환할 수 있는 위치가 아닙니다.`)
          }
          return
        }
      }
      player.sendMessage(`tp > 이름 ${messageComponents[1]}은 유효하지 않습니다.`)
      player.sendMessage("접속중인 사용자:")
      world.getAllPlayers().forEach(target => {
        player.sendMessage("    " + target.name);
      });
      return
    }

    case "!sethome": {
      if (player.dimension.id != "minecraft:overworld") {
        player.sendMessage(`sethome > 홈 설정은 오버월드에서만 가능합니다.`)
        return
      }
      let hlScoreboard = world.scoreboard.getObjective(HOME_LOCATION_SCOREBOARD)
  
      // Initialize scoreboards if not present.
      if (!hlScoreboard){
        hlScoreboard = world.scoreboard.addObjective(HOME_LOCATION_SCOREBOARD, "Home-Location")
      }

      hlScoreboard.setScore("x", player.location.x)
      hlScoreboard.setScore("y", player.location.y)
      hlScoreboard.setScore("z", player.location.z)
      
      player.sendMessage(`sethome > 성공!`)
      return
      
    }

    case "!home": {
      let hlScoreboard = world.scoreboard.getObjective(HOME_LOCATION_SCOREBOARD)
  
      if (!hlScoreboard){
        player.sendMessage(`home > 집 위치가 설정되지 않았습니다.`)
        return
      }
      let px = hlScoreboard.getScore("x")
      let py = hlScoreboard.getScore("y")
      let pz = hlScoreboard.getScore("z")
      if( px != undefined && py != undefined && pz != undefined){
        let tpSuccess = player.tryTeleport({x: px, y: py, z: pz}, {dimension: world.getDimension("minecraft:overworld")})
          if (tpSuccess){
            
            player.resetLevel()
            player.sendMessage(`home > 집으로 소환되었습니다.`)
          } else {
            player.sendMessage(`home > 집은 현재 소환할 수 있는 위치가 아닙니다.`)
          }
          return
      }

      player.sendMessage(`home > 오류`)
      return
    }
  }
}


function onEntityDie(eventData: EntityDieAfterEvent){
  let e = eventData.deadEntity
  if (e instanceof Player){
    let inventory = e.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent
    let equipment = e.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent
    let pos = undefined
    if (inventory && equipment){
      // Find suitable void location in vertical area

      if (!(e.id in groundedPositionMap)){
        e.sendMessage("서버 > 에러로 인해 아이템이 유지되었습니다. 관리자에게 문의해 주세요")
        return
      }
      pos = {x: groundedPositionMap[e.id].x, y: groundedPositionMap[e.id].y, z: groundedPositionMap[e.id].z}  as Vector3
      console.log(pos.x, pos.y, pos.z)
      e.dimension.setBlockType(pos, "minecraft:chest")

      if (pos){
        console.log(1)
        let chest = e.dimension.getBlock(pos)
        let chestContainer = chest?.getComponent(BlockComponentTypes.Inventory)?.container
        
        // Success! Actual logic from now on
        let size = inventory.container?.size

        
        if (chestContainer && size){  
          console.log(2)
          for (let slot of [EquipmentSlot.Chest, EquipmentSlot.Feet, EquipmentSlot.Head, EquipmentSlot.Legs, EquipmentSlot.Mainhand, EquipmentSlot.Offhand]){
            let eq = equipment.getEquipment(slot)
            if (eq){
              let success = chestContainer.addItem(eq)
              if (success instanceof ItemStack){
                e.dimension.spawnItem(success, {x: pos.x, y: pos.y + 1, z: pos.z})
              }
            }
            equipment.setEquipment(slot, undefined)
          }

          for(let i = 0; i < size; i++){
            let success = inventory.container?.transferItem(i, chestContainer)
            if (success instanceof ItemStack){
              e.dimension.spawnItem(success, {x: pos.x, y: pos.y + 1, z: pos.z})
            }
          }


          inventory.container?.clearAll()
          let is = new ItemStack("minecraft:paper", 1)
          is.nameTag =`사망 위치: ${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)}`
          inventory.container?.addItem(is)
        }
      }
    }
  }
}

function _findVoidBlockInRadius(e: Entity, i: number): Vector3 | undefined{
  let blocks = e.dimension.getBlocks(new BlockVolume({x: e.location.x - i, y: e.location.y - i, z: e.location.z - i}, {x: e.location.x + i, y: e.location.y + i, z: e.location.z + i}), 
                  {includeTypes: ["minecraft:air"]}, true)
  let blockpos: Vector3 | undefined = undefined
  for (let i of blocks.getBlockLocationIterator()){
    blockpos = i
    break
  }
  return blockpos
  
}
function checkPlayersLastGroundedPosition(){
  for(let i of world.getAllPlayers()){
    if (i.isOnGround && !i.dimension.getBlock(i.getHeadLocation())?.isLiquid){
      
      try{
      
      groundedPositionMap[i.id] = {x: i.location.x, y: i.location.y, z: i.location.z};
      } catch (e){

        console.log(e)
      }
    }
  }

}