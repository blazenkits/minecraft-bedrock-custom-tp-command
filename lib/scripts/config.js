export const SERVER_NAME = "서버";
export const VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
export const HOME_LOCATION_SCOREBOARD = "HOME_LOCATION_SCOREBOARD";
export const WORLD_CONFIG_SCOREBOARD = "WORLD_CONFIG_SCOREBOARD";
export const README_LINK = "https://bit.ly/3wimntH";
export const WorldConfigs = {
    TP_ENABLE: 1, // Enable !tp
    TP_CLEAR_LEVELS_AMOUNT: 3, // Remove levels on tp
    HOME_ENABLE: 1,
    DEATH_SPAWN_CHEST_ENABLE: 1, // Enable death chest
    NETHER_ENEMY_SPAWN_INHIBIT_ENABLE: 1, // Enable nether spawn inhibit
    NETHER_MOB_SPAWN_INHIBIT_RADIUS: 100, // Nether spawn inhibition radius
    DEBUG_LOG: 0 // Send debug messages (Should be turned off)
};
// Mobs to blacklist near nether base
export const NETHER_ENEMY_SPAWN_BLACKLIST = [
    'minecraft:skeleton',
    'minecraft:ghast'
];
//# sourceMappingURL=config.js.map