# 기능
## 커맨드
### 사용자 순간이동
`!tp <사용자이름>`
- 순간이동시, 경험치를 얼마정도 잃게 됩니다.

### 집으로 순간이동
`!home`

### 집 위치를 설정
`!sethome` (Operator만 접근가능)

사용자의 위치를 집으로 설정합니다.
- 오버월드에서만 설정이 가능합니다.

### 데이터팩 재시작
`!restart` (Operator만 접근가능)

`!restart default`: 변수 초기화 (Operator만 접근가능)

## QoL 기능

### 사망시 상자 생성
- 사망시 죽은 위치에 상자를 생성한 후, 아이템을 보관합니다.
- 상자는 사용자의 머리가 공기중에 있었고, 발이 땅에 닿아 있었던 마지막 발 위치에 생성됩니다.
- 상자에 들어갈 수 있는 아이템수보다 가진 아이템이 많은 경우 아이템은 상자 밖으로 떨어질 수 있습니다.
- 아이템 저장 우선순위는 갑옷 -> 핫바 -> 인벤 순입니다. 

### 네더 스폰 보호
- 네더 안 `home`의 위치 근방에는 특정 몹 (스켈레톤, 가스트)가 스폰할 수 없습니다.
- 기본값 xyz방향 100블록 (`WORLD_CONFIG_SCOREBOARD`의 `MOB_SPAWN_INHIBIT_RADIUS`를 통해 수정 가능)

# Technical
## Building
Template from https://github.com/microsoft/minecraft-scripting-samples/

Building from npm: https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted?view=minecraft-bedrock-stable

Requires beta API (>=@minecraft/server:1.11.0-beta)

Tested on 1.20
## Installing
1. Enable 'Experimental Features > Beta API' in your world.
2. For the death chest spawning to work, Enable 'Cheats > Keep Inventory' in your world.
3. You can modify the script constants from the `WORLD_CONFIG_SCOREBOARD`. To do this in-game, use `/scoreboard players set (variable_name) WORLD_CONFIG_SCOREBOARD (value)`.
See `config.WorldConfigs` for available`{variable_names}`.
