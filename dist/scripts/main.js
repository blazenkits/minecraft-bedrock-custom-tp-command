var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/@minecraft/math/lib/general/clamp.js
var require_clamp = __commonJS({
  "node_modules/@minecraft/math/lib/general/clamp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clampNumber = void 0;
    function clampNumber(val, min, max) {
      return Math.min(Math.max(val, min), max);
    }
    exports.clampNumber = clampNumber;
  }
});

// node_modules/@minecraft/math/lib/vector3/coreHelpers.js
var require_coreHelpers = __commonJS({
  "node_modules/@minecraft/math/lib/vector3/coreHelpers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VECTOR3_SOUTH = exports.VECTOR3_NORTH = exports.VECTOR3_EAST = exports.VECTOR3_WEST = exports.VECTOR3_ZERO = exports.VECTOR3_ONE = exports.VECTOR3_BACK = exports.VECTOR3_FORWARD = exports.VECTOR3_RIGHT = exports.VECTOR3_LEFT = exports.VECTOR3_DOWN = exports.VECTOR3_UP = exports.Vector2Utils = exports.Vector3Utils = void 0;
    var clamp_1 = require_clamp();
    var Vector3Utils2 = class _Vector3Utils {
      /**
       * equals
       *
       * Check the equality of two vectors
       */
      static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
      }
      /**
       * add
       *
       * Add two vectors to produce a new vector
       */
      static add(v1, v2) {
        return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
      }
      /**
       * subtract
       *
       * Subtract two vectors to produce a new vector (v1-v2)
       */
      static subtract(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
      }
      /** scale
       *
       * Multiple all entries in a vector by a single scalar value producing a new vector
       */
      static scale(v1, scale) {
        return { x: v1.x * scale, y: v1.y * scale, z: v1.z * scale };
      }
      /**
       * dot
       *
       * Calculate the dot product of two vectors
       */
      static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
      }
      /**
       * cross
       *
       * Calculate the cross product of two vectors. Returns a new vector.
       */
      static cross(a, b) {
        return {
          x: a.y * b.z - a.z * b.y,
          y: a.z * b.x - a.x * b.z,
          z: a.x * b.y - a.y * b.x
        };
      }
      /**
       * magnitude
       *
       * The magnitude of a vector
       */
      static magnitude(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
      }
      /**
       * distance
       *
       * Calculate the distance between two vectors
       */
      static distance(a, b) {
        return _Vector3Utils.magnitude(_Vector3Utils.subtract(a, b));
      }
      /**
       * normalize
       *
       * Takes a vector 3 and normalizes it to a unit vector
       */
      static normalize(v) {
        const mag = _Vector3Utils.magnitude(v);
        return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
      }
      /**
       * floor
       *
       * Floor the components of a vector to produce a new vector
       */
      static floor(v) {
        return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
      }
      /**
       * toString
       *
       * Create a string representation of a vector3
       */
      static toString(v, options) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
        return str.join(options?.delimiter ?? ", ");
      }
      /**
       * clamp
       *
       * Clamps the components of a vector to limits to produce a new vector
       */
      static clamp(v, limits) {
        return {
          x: (0, clamp_1.clampNumber)(v.x, limits?.min?.x ?? Number.MIN_SAFE_INTEGER, limits?.max?.x ?? Number.MAX_SAFE_INTEGER),
          y: (0, clamp_1.clampNumber)(v.y, limits?.min?.y ?? Number.MIN_SAFE_INTEGER, limits?.max?.y ?? Number.MAX_SAFE_INTEGER),
          z: (0, clamp_1.clampNumber)(v.z, limits?.min?.z ?? Number.MIN_SAFE_INTEGER, limits?.max?.z ?? Number.MAX_SAFE_INTEGER)
        };
      }
      /**
       * lerp
       *
       * Constructs a new vector using linear interpolation on each component from two vectors.
       */
      static lerp(a, b, t) {
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          z: a.z + (b.z - a.z) * t
        };
      }
      /**
       * slerp
       *
       * Constructs a new vector using spherical linear interpolation on each component from two vectors.
       */
      static slerp(a, b, t) {
        const theta = Math.acos(_Vector3Utils.dot(a, b));
        const sinTheta = Math.sin(theta);
        const ta = Math.sin((1 - t) * theta) / sinTheta;
        const tb = Math.sin(t * theta) / sinTheta;
        return _Vector3Utils.add(_Vector3Utils.scale(a, ta), _Vector3Utils.scale(b, tb));
      }
    };
    exports.Vector3Utils = Vector3Utils2;
    var Vector2Utils = class {
      /**
       * toString
       *
       * Create a string representation of a vector2
       */
      static toString(v, options) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals)];
        return str.join(options?.delimiter ?? ", ");
      }
    };
    exports.Vector2Utils = Vector2Utils;
    exports.VECTOR3_UP = { x: 0, y: 1, z: 0 };
    exports.VECTOR3_DOWN = { x: 0, y: -1, z: 0 };
    exports.VECTOR3_LEFT = { x: -1, y: 0, z: 0 };
    exports.VECTOR3_RIGHT = { x: 1, y: 0, z: 0 };
    exports.VECTOR3_FORWARD = { x: 0, y: 0, z: 1 };
    exports.VECTOR3_BACK = { x: 0, y: 0, z: -1 };
    exports.VECTOR3_ONE = { x: 1, y: 1, z: 1 };
    exports.VECTOR3_ZERO = { x: 0, y: 0, z: 0 };
    exports.VECTOR3_WEST = { x: -1, y: 0, z: 0 };
    exports.VECTOR3_EAST = { x: 1, y: 0, z: 0 };
    exports.VECTOR3_NORTH = { x: 0, y: 0, z: 1 };
    exports.VECTOR3_SOUTH = { x: 0, y: 0, z: -1 };
  }
});

// node_modules/@minecraft/math/lib/vector3/vectorWrapper.js
var require_vectorWrapper = __commonJS({
  "node_modules/@minecraft/math/lib/vector3/vectorWrapper.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vector2Builder = exports.Vector3Builder = void 0;
    var coreHelpers_1 = require_coreHelpers();
    var Vector3Builder = class {
      constructor(first, y, z) {
        if (typeof first === "object") {
          this.x = first.x;
          this.y = first.y;
          this.z = first.z;
        } else {
          this.x = first;
          this.y = y ?? 0;
          this.z = z ?? 0;
        }
      }
      /**
       * Assigns the values of the passed in vector to this vector. Returns itself.
       */
      assign(vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        return this;
      }
      /**
       * equals
       *
       * Check the equality of two vectors
       */
      equals(v) {
        return coreHelpers_1.Vector3Utils.equals(this, v);
      }
      /**
       * add
       *
       * Adds the vector v to this, returning itself.
       */
      add(v) {
        return this.assign(coreHelpers_1.Vector3Utils.add(this, v));
      }
      /**
       * subtract
       *
       * Subtracts the vector v from this, returning itself.
       */
      subtract(v) {
        return this.assign(coreHelpers_1.Vector3Utils.subtract(this, v));
      }
      /** scale
       *
       * Scales this by the passed in value, returning itself.
       */
      scale(val) {
        return this.assign(coreHelpers_1.Vector3Utils.scale(this, val));
      }
      /**
       * dot
       *
       * Computes the dot product of this and the passed in vector.
       */
      dot(vec) {
        return coreHelpers_1.Vector3Utils.dot(this, vec);
      }
      /**
       * cross
       *
       * Computes the cross product of this and the passed in vector, returning itself.
       */
      cross(vec) {
        return this.assign(coreHelpers_1.Vector3Utils.cross(this, vec));
      }
      /**
       * magnitude
       *
       * The magnitude of the vector
       */
      magnitude() {
        return coreHelpers_1.Vector3Utils.magnitude(this);
      }
      /**
       * distance
       *
       * Calculate the distance between two vectors
       */
      distance(vec) {
        return coreHelpers_1.Vector3Utils.distance(this, vec);
      }
      /**
       * normalize
       *
       * Normalizes this vector, returning itself.
       */
      normalize() {
        return this.assign(coreHelpers_1.Vector3Utils.normalize(this));
      }
      /**
       * floor
       *
       * Floor the components of a vector to produce a new vector
       */
      floor() {
        return this.assign(coreHelpers_1.Vector3Utils.floor(this));
      }
      /**
       * toString
       *
       * Create a string representation of a vector
       */
      toString(options) {
        return coreHelpers_1.Vector3Utils.toString(this, options);
      }
      /**
       * clamp
       *
       * Clamps the components of a vector to limits to produce a new vector
       */
      clamp(limits) {
        return this.assign(coreHelpers_1.Vector3Utils.clamp(this, limits));
      }
      /**
       * lerp
       *
       * Constructs a new vector using linear interpolation on each component from two vectors.
       */
      lerp(vec, t) {
        return this.assign(coreHelpers_1.Vector3Utils.lerp(this, vec, t));
      }
      /**
       * slerp
       *
       * Constructs a new vector using spherical linear interpolation on each component from two vectors.
       */
      slerp(vec, t) {
        return this.assign(coreHelpers_1.Vector3Utils.slerp(this, vec, t));
      }
    };
    exports.Vector3Builder = Vector3Builder;
    var Vector2Builder = class {
      constructor(first, y) {
        if (typeof first === "object") {
          this.x = first.x;
          this.y = first.y;
        } else {
          this.x = first;
          this.y = y ?? 0;
        }
      }
      toString(options) {
        return coreHelpers_1.Vector2Utils.toString(this, options);
      }
    };
    exports.Vector2Builder = Vector2Builder;
  }
});

// node_modules/@minecraft/math/lib/vector3/index.js
var require_vector3 = __commonJS({
  "node_modules/@minecraft/math/lib/vector3/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_coreHelpers(), exports);
    __exportStar(require_vectorWrapper(), exports);
  }
});

// node_modules/@minecraft/math/lib/general/index.js
var require_general = __commonJS({
  "node_modules/@minecraft/math/lib/general/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_clamp(), exports);
  }
});

// node_modules/@minecraft/math/lib/index.js
var require_lib = __commonJS({
  "node_modules/@minecraft/math/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
          __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_vector3(), exports);
    __exportStar(require_general(), exports);
  }
});

// scripts/main.ts
import {
  world as world2,
  system,
  Player as Player2,
  EntityComponentTypes,
  BlockComponentTypes,
  ItemStack,
  EquipmentSlot,
  EntityInitializationCause
} from "@minecraft/server";

// scripts/maintenance.ts
var BP_VERSION = 4;
var version_documentation = {
  0: ["!tp <\uC0AC\uC6A9\uC790 \uC774\uB984> -> \uC0AC\uC6A9\uC790\uC5D0\uAC8C \uC21C\uAC04\uC774\uB3D9\uD568."],
  1: ["!home -> \uC9D1\uC73C\uB85C tp"],
  2: ["\uC774\uC81C \uC0AC\uB9DD\uC2DC \uC544\uC774\uD15C\uC774 \uC8FD\uC740 \uC704\uCE58\uC758 \uC0C1\uC790\uB85C \uC774\uB3D9\uB429\uB2C8\uB2E4. \uB2E8 \uC544\uC774\uD15C\uC774 \uB108\uBB34 \uB9CE\uC740 \uACBD\uC6B0 \uADF8\uB300\uB85C \uB5A8\uC5B4\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4."],
  3: ["\uC6A9\uC554\uC5D0\uC11C \uC0AC\uB9DD\uC2DC \uC0C1\uC790\uAC00 \uC6A9\uC554 \uC544\uB798\uC5D0 \uC0DD\uC131\uB418\uB294 \uBC84\uADF8 \uC218\uC815"],
  4: ["\uB124\uB354 \uB108\uD504 (\uB9C1\uD06C \uD655\uC778)"]
};

// scripts/commands.ts
import { world } from "@minecraft/server";

// scripts/config.ts
var SERVER_NAME = "\uC11C\uBC84";
var VERSION_CHECK_SCOREBOARD = "VERSION_CHECK_SCOREBOARD";
var HOME_LOCATION_SCOREBOARD = "HOME_LOCATION_SCOREBOARD";
var WORLD_CONFIG_SCOREBOARD = "WORLD_CONFIG_SCOREBOARD";
var README_LINK = "https://bit.ly/3wimntH";
var WorldConfigs = {
  TP_ENABLE: 1,
  NETHER_ENEMY_SPAWN_INHIBIT_ENABLE: 1,
  NETHER_ENEMY_DEBUF_STRENGTH: 0,
  MOB_SPAWN_INHIBIT_RADIUS: 100,
  DEBUG_LOG: 0
};
var NETHER_ENEMY_SPAWN_BLACKLIST = [
  "minecraft:skeleton",
  "minecraft:ghast"
];

// scripts/commands.ts
function processCustomCommands(messageComponents, player) {
  if (messageComponents.length == 0)
    return;
  switch (messageComponents[0]) {
    case "!tp": {
      if (messageComponents.length != 2) {
        player.sendMessage(`tp > \uC0AC\uC6A9\uBC95 '!tp <playername>'`);
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
      sendPlayerListMessage(player);
      return;
    }
    case "!sethome": {
      if (player.dimension.id != "minecraft:overworld") {
        player.sendMessage(`sethome > \uD648 \uC124\uC815\uC740 \uC624\uBC84\uC6D4\uB4DC\uC5D0\uC11C\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4.`);
        return;
      }
      if (!player.isOp) {
        player.sendMessage(`sethome > \uD648 \uC124\uC815\uC740 Operator aaaa\uAD8C\uD55C\uC744 \uAC00\uC9C4 \uC0AC\uC6A9\uC790\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4.`);
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
        let tpSuccess = player.tryTeleport(
          { x: px, y: py, z: pz },
          { dimension: world.getDimension("minecraft:overworld") }
        );
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
function sendPlayerListMessage(player) {
  player.sendMessage("\uC811\uC18D\uC911\uC778 \uC0AC\uC6A9\uC790:");
  world.getAllPlayers().forEach((target) => {
    player.sendMessage("    " + target.name);
  });
}

// scripts/main.ts
var import_math = __toESM(require_lib());
var groundedPositionMap = {};
system.run(mainLoop);
world2.afterEvents.chatSend.subscribe(onPlayerChatSend);
world2.afterEvents.playerSpawn.subscribe(onPlayerSpawn);
world2.afterEvents.entityDie.subscribe(onEntityDie);
world2.afterEvents.entitySpawn.subscribe(onEntitySpawn);
world2.afterEvents.worldInitialize.subscribe(onWorldInitialize);
function onWorldInitialize(eventData) {
  let wcScoreboard = world2.scoreboard.getObjective(WORLD_CONFIG_SCOREBOARD);
  if (!wcScoreboard) {
    wcScoreboard = world2.scoreboard.addObjective(WORLD_CONFIG_SCOREBOARD, "World-Configs");
    wcScoreboard.setScore("TP_ENABLE", 1);
    wcScoreboard.setScore("NETHER_ENEMY_SPAWN_INHIBIT_ENABLE", 1);
    wcScoreboard.setScore("NETHER_ENEMY_DEBUF_STRENGTH", 0);
    wcScoreboard.setScore("MOB_SPAWN_INHIBIT_RADIUS", 50);
    wcScoreboard.setScore("DEBUG_LOG", 0);
  } else {
    for (let s of wcScoreboard.getScores()) {
      let n = s.participant.displayName;
      world2.sendMessage(">>" + n);
      if (n in WorldConfigs) {
        WorldConfigs[n] = s.score;
        world2.sendMessage(`Successfully configured WorldConfigs ${n} to ${s.score}.`);
      }
    }
  }
}
var ticks = 1;
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
  eventData.player.sendMessage(
    `\uD604\uC7AC\uC2DC\uAC04\uC740 ${world2.getDay()}\uC77C ${Math.floor(world2.getTimeOfDay() / 1e3)}\uC2DC ${Math.floor(
      world2.getTimeOfDay() % 1e3 / 1e3 * 60
    )}\uBD84 \uC785\uB2C8\uB2E4.`
  );
  let joinedString = world2.getAllPlayers().map((player) => player.name).join(", ");
  eventData.player.sendMessage("\uD604\uC7AC \uC811\uC18D\uC790\uB294 " + joinedString + "\uC785\uB2C8\uB2E4.");
  let vcScoreboard = world2.scoreboard.getObjective(VERSION_CHECK_SCOREBOARD);
  if (!vcScoreboard) {
    vcScoreboard = world2.scoreboard.addObjective(VERSION_CHECK_SCOREBOARD, "Player-Versions");
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
  eventData.player.sendMessage(`\uC11C\uBC84 \uAE30\uB2A5 \uC124\uBA85: ${README_LINK}`);
  eventData.player.sendMessage(`====================================`);
}
function onPlayerChatSend(eventData) {
  let player = eventData.sender;
  let messageComponents = eventData.message.split(" ");
  processCustomCommands(messageComponents, player);
}
function onEntityDie(eventData) {
  let e = eventData.deadEntity;
  if (e instanceof Player2) {
    let inventory = e.getComponent(EntityComponentTypes.Inventory);
    let equipment = e.getComponent(EntityComponentTypes.Equippable);
    let pos = void 0;
    if (!world2.gameRules.keepInventory)
      return;
    if (inventory && equipment) {
      if (!(e.id in groundedPositionMap)) {
        e.sendMessage("\uC11C\uBC84 > \uC5D0\uB7EC\uB85C \uC778\uD574 \uC544\uC774\uD15C\uC774 \uC720\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694");
        return;
      }
      pos = {
        x: groundedPositionMap[e.id].x,
        y: groundedPositionMap[e.id].y,
        z: groundedPositionMap[e.id].z
      };
      console.log(pos.x, pos.y, pos.z);
      e.dimension.setBlockType(pos, "minecraft:chest");
      if (pos) {
        console.log(1);
        let chest = e.dimension.getBlock(pos);
        let chestContainer = chest?.getComponent(BlockComponentTypes.Inventory)?.container;
        let size = inventory.container?.size;
        if (chestContainer && size) {
          console.log(2);
          for (let slot of [
            EquipmentSlot.Chest,
            EquipmentSlot.Feet,
            EquipmentSlot.Head,
            EquipmentSlot.Legs,
            EquipmentSlot.Mainhand,
            EquipmentSlot.Offhand
          ]) {
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
function onEntitySpawn(eventData) {
  if (eventData.cause == EntityInitializationCause.Spawned) {
    if (eventData.entity.dimension.id == "minecraft:nether" && NETHER_ENEMY_SPAWN_BLACKLIST.indexOf(eventData.entity.typeId) != -1) {
      let hl = getHomeLocation();
      if (hl) {
        hl = import_math.Vector3Utils.scale(hl, 1 / 8);
        let l = import_math.Vector3Utils.distance(eventData.entity.location, hl);
        if (l < WorldConfigs.MOB_SPAWN_INHIBIT_RADIUS) {
          dlog(`(onEntitySpawn) Removing nether enemy ${eventData.entity.typeId} (distance ${l} @ ${import_math.Vector3Utils.toString(eventData.entity.location, { decimals: 1 })})`);
          eventData.entity.remove();
        }
      }
    }
  }
}
function getHomeLocation() {
  let hlScoreboard = world2.scoreboard.getObjective(HOME_LOCATION_SCOREBOARD);
  if (!hlScoreboard)
    return void 0;
  let px = hlScoreboard.getScore("x");
  let py = hlScoreboard.getScore("y");
  let pz = hlScoreboard.getScore("z");
  if (!px || !py || !pz)
    return void 0;
  return { x: px, y: py, z: pz };
}
function checkPlayersLastGroundedPosition() {
  for (let i of world2.getAllPlayers()) {
    if (i.isOnGround && !i.dimension.getBlock(i.getHeadLocation())?.isLiquid) {
      try {
        groundedPositionMap[i.id] = { x: i.location.x, y: i.location.y, z: i.location.z };
      } catch (e) {
        console.log(e);
      }
    }
  }
}
function dlog(s) {
  if (WorldConfigs.DEBUG_LOG)
    world2.sendMessage("> (Server Debug): " + s);
}

//# sourceMappingURL=../debug/main.js.map
