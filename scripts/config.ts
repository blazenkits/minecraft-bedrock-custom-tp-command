export const SERVER_NAME = "서버";

export const VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
export const HOME_LOCATION_SCOREBOARD = "HOME_LOCATION_SCOREBOARD";
export const WORLD_CONFIG_SCOREBOARD  = "WORLD_CONFIG_SCOREBOARD" ;
export const UUID = "90430917-0e61-48c1-800e-babda0b3bd36";
export const README_LINK = "https://bit.ly/3wimntH"
export const WorldConfigs : {[key: string]: number} = {
  TP_ENABLE: 1,
  NETHER_ENEMY_SPAWN_INHIBIT_ENABLE: 1,
  NETHER_ENEMY_DEBUF_STRENGTH: 0,
  MOB_SPAWN_INHIBIT_RADIUS: 100,
  DEBUG_LOG: 0
}
export const NETHER_ENEMY_SPAWN_BLACKLIST = [
  'minecraft:skeleton',
  'minecraft:ghast'
]