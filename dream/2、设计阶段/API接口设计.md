# 《宠魅：灵魂羁绊》API接口设计

## 1. API设计原则

### 1.1 RESTful 风格

遵循 REST 架构风格，使用标准 HTTP 方法和状态码。

### 1.2 URL 设计规范

- 使用名词复数: `/api/pets`
- 使用小写和连字符: `/api/soul-pets`
- 层级关系: `/api/players/:id/pets`
- 版本控制: `/api/v1/...`

### 1.3 响应格式

#### 1.3.1 成功响应

```json
{
  "success": true,
  "data": {
    // 实际数据
  },
  "message": "操作成功",
  "timestamp": "2026-01-04T10:00:00Z"
}
```

#### 1.3.2 错误响应

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "参数验证失败",
    "details": {
      "name": "玩家昵称不能为空"
    }
  },
  "timestamp": "2026-01-04T10:00:00Z"
}
```

### 1.4 HTTP 状态码

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 OK | 请求成功 | GET, PUT, PATCH |
| 201 Created | 资源创建 | POST |
| 204 No Content | 成功无返回内容 | DELETE |
| 400 Bad Request | 参数错误 | 验证失败 |
| 401 Unauthorized | 未认证 | Token 无效 |
| 403 Forbidden | 无权限 | 权限不足 |
| 404 Not Found | 资源不存在 | ID 不存在 |
| 409 Conflict | 资源冲突 | 昵称重复 |
| 422 Unprocessable Entity | 无法处理 | 业务规则不满足 |
| 429 Too Many Requests | 请求过多 | 超过限流 |
| 500 Internal Server Error | 服务器错误 | 未知错误 |

### 1.5 分页设计

#### 1.5.1 请求参数

```
GET /api/pets?page=1&pageSize=20&sortBy=level&order=desc
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | Number | 否 | 页码，默认1 |
| `pageSize` | Number | 否 | 每页数量，默认20 |
| `sortBy` | String | 否 | 排序字段 |
| `order` | String | 否 | 排序方向 (asc/desc) |

#### 1.5.2 响应格式

```json
{
  "success": true,
  "data": {
    "items": [
      // 数据列表
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

## 2. 认证接口

### 2.1 用户注册

**接口**: `POST /api/v1/auth/register`

**请求体**:
```json
{
  "name": "楚暮",
  "email": "chumu@example.com",
  "password": "securePassword123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "playerId": "player-123",
    "name": "楚暮",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "initialPet": {
      "uid": "pet-456",
      "speciesId": "1001",
      "name": "月光狐",
      "level": 1
    }
  }
}
```

### 2.2 用户登录

**接口**: `POST /api/v1/auth/login`

**请求体**:
```json
{
  "email": "chumu@example.com",
  "password": "securePassword123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "player": {
      "id": "player-123",
      "name": "楚暮",
      "level": "魂士",
      "soulPower": 100,
      "gold": 0
    }
  }
}
```

### 2.3 刷新 Token

**接口**: `POST /api/v1/auth/refresh`

**请求头**:
```
Authorization: Bearer <old_token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 3. 玩家接口

### 3.1 获取玩家信息

**接口**: `GET /api/v1/player/info`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "player-123",
    "name": "楚暮",
    "soulPower": 85,
    "maxSoulPower": 100,
    "level": "魂士",
    "gold": 500,
    "pactSlots": [
      {
        "slotId": 1,
        "petUid": "pet-456",
        "isLocked": false
      },
      {
        "slotId": 2,
        "petUid": null,
        "isLocked": true,
        "unlockLevel": "魂师"
      }
    ],
    "inventory": [
      {
        "itemId": "item-001",
        "name": "月光石",
        "quantity": 5,
        "description": "提升月系技能威力"
      }
    ]
  }
}
```

### 3.2 更新玩家状态

**接口**: `PUT /api/v1/player/update`

**请求体**:
```json
{
  "soulPower": 90,
  "gold": 550
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "soulPower": 90,
    "gold": 550
  }
}
```

---

## 4. 魂宠接口

### 4.1 获取魂宠列表

**接口**: `GET /api/v1/pets/list`

**查询参数**:
- `page`: 页码 (默认1)
- `pageSize`: 每页数量 (默认20)
- `sortBy`: 排序字段 (level, loyalty, etc.)
- `order`: 排序方向 (asc/desc)

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "uid": "pet-456",
        "speciesId": "1001",
        "name": "月光狐",
        "nickname": "莫邪",
        "level": 5,
        "exp": 500,
        "rank": "奴仆级",
        "elements": ["妖灵"],
        "hp": 65,
        "maxHp": 65,
        "stamina": 85,
        "maxStamina": 85,
        "attack": 18,
        "defense": 12,
        "speed": 28,
        "learnedSkills": ["S001", "S003"],
        "loyalty": 85,
        "mutationPoints": 10
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### 4.2 获取魂宠详情

**接口**: `GET /api/v1/pets/:uid`

**响应**:
```json
{
  "success": true,
  "data": {
    "uid": "pet-456",
    "speciesId": "1001",
    "name": "月光狐",
    "nickname": "莫邪",
    "level": 5,
    "exp": 500,
    "maxExp": 1000,
    "rank": "奴仆级",
    "elements": ["妖灵"],
    "description": "一种高贵的狐族魂宠，拥有银色的毛发和优雅的身姿。",
    "hp": 65,
    "maxHp": 65,
    "stamina": 85,
    "maxStamina": 85,
    "attack": 18,
    "defense": 12,
    "speed": 28,
    "learnedSkills": [
      {
        "skillId": "S001",
        "name": "月光",
        "element": "妖灵",
        "type": "辅助",
        "power": 0,
        "cost": 5,
        "description": "沐浴月光，缓慢恢复体力。"
      }
    ],
    "loyalty": 85,
    "mutationPoints": 10,
    "evolutions": [
      {
        "targetId": "1002",
        "type": "evolution",
        "condition": {
          "minLevel": 20,
          "description": "正常成长进化"
        }
      },
      {
        "targetId": "1005",
        "type": "mutation",
        "condition": {
          "description": "濒死状态下爆发强大的求生欲",
          "minMutationPoints": 100
        }
      }
    ]
  }
}
```

### 4.3 魂宠升级

**接口**: `POST /api/v1/pets/:uid/level-up`

**请求体**:
```json
{
  "exp": 500,
  "items": ["item-002"]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "success": true,
    "newLevel": 6,
    "newPet": {
      "uid": "pet-456",
      "level": 6,
      "exp": 0,
      "maxExp": 1200,
      "hp": 70,
      "maxHp": 70,
      "attack": 20,
      "defense": 13,
      "speed": 30
    },
    "learnedSkill": {
      "skillId": "S004",
      "name": "月影"
    },
    "logs": [
      "莫邪 升级到了 Lv.6！",
      "学习了新技能：月影"
    ]
  }
}
```

### 4.4 魂宠异变

**接口**: `POST /api/v1/pets/:uid/evolve`

**请求体**:
```json
{
  "evolutionId": "evol-1002",
  "items": ["item-003"]
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "success": true,
    "newPet": {
      "uid": "pet-456",
      "speciesId": "1002",
      "name": "冕焰之狐",
      "nickname": "莫邪",
      "level": 6,
      "rank": "战将级",
      "elements": ["火", "妖灵"],
      "hp": 120,
      "maxHp": 120,
      "attack": 35,
      "defense": 25,
      "speed": 40
    },
    "logs": [
      "奇迹发生了！",
      "莫邪 从 月光狐 异变为 冕焰之狐！",
      "种族等级提升到 战将级！",
      "获得了新的属性：火"
    ]
  }
}
```

### 4.5 设置出战魂宠

**接口**: `PUT /api/v1/pets/:uid/set-active`

**响应**:
```json
{
  "success": true,
  "data": {
    "activePet": {
      "uid": "pet-456",
      "name": "莫邪"
    }
  }
}
```

---

## 5. 战斗接口

### 5.1 开始战斗

**接口**: `POST /api/v1/battle/start`

**请求体**:
```json
{
  "playerPetId": "pet-456",
  "enemyPetId": "pet-789",
  "environment": "夜晚"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "battleId": "battle-123",
    "state": {
      "battleId": "battle-123",
      "round": 0,
      "playerPet": {
        "uid": "pet-456",
        "name": "莫邪",
        "hp": 65,
        "maxHp": 65,
        "stamina": 85,
        "maxStamina": 85,
        "stats": {
          "attack": 18,
          "defense": 12,
          "speed": 28
        }
      },
      "enemyPet": {
        "uid": "pet-789",
        "name": "野生的月光狐",
        "hp": 60,
        "maxHp": 60,
        "stamina": 80,
        "maxStamina": 80,
        "stats": {
          "attack": 15,
          "defense": 10,
          "speed": 25
        }
      },
      "isPlayerTurn": true,
      "battleStatus": "active",
      "environment": "夜晚"
    },
    "logs": [
      {
        "id": "log-1",
        "round": 0,
        "source": "system",
        "type": "system",
        "message": "战斗开始！夜晚环境下，妖灵系技能威力提升！",
        "timestamp": "2026-01-04T10:00:00Z"
      }
    ]
  }
}
```

### 5.2 提交行动

**接口**: `POST /api/v1/battle/:battleId/action`

**请求体**:
```json
{
  "actionType": "skill",
  "actionData": {
    "skillId": "S003"
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "result": {
      "success": true,
      "damage": 25,
      "isCritical": true,
      "effect": "burn"
    },
    "state": {
      "battleId": "battle-123",
      "round": 1,
      "playerPet": {
        "uid": "pet-456",
        "hp": 65,
        "maxHp": 65,
        "stamina": 75,
        "maxStamina": 85
      },
      "enemyPet": {
        "uid": "pet-789",
        "hp": 35,
        "maxHp": 60,
        "stamina": 80,
        "maxStamina": 80,
        "statusEffects": [
          {
            "type": "burn",
            "duration": 3,
            "value": 4
          }
        ]
      },
      "isPlayerTurn": false,
      "battleStatus": "active"
    },
    "logs": [
      {
        "id": "log-2",
        "round": 1,
        "source": "player",
        "type": "skill",
        "message": "莫邪 使用了 撕裂爪！",
        "timestamp": "2026-01-04T10:00:01Z"
      },
      {
        "id": "log-3",
        "round": 1,
        "source": "player",
        "type": "damage",
        "message": "造成 25 点伤害！暴击！",
        "value": 25,
        "timestamp": "2026-01-04T10:00:01Z"
      },
      {
        "id": "log-4",
        "round": 1,
        "source": "player",
        "type": "status",
        "message": "目标陷入 灼烧 状态！",
        "timestamp": "2026-01-04T10:00:01Z"
      }
    ]
  }
}
```

### 5.3 结束战斗

**接口**: `POST /api/v1/battle/:battleId/finish`

**响应**:
```json
{
  "success": true,
  "data": {
    "winner": "player",
    "exp": 100,
    "gold": 50,
    "items": [
      {
        "itemId": "item-004",
        "name": "低级灵核",
        "quantity": 2
      }
    ],
    "petRewards": [
      {
        "petUid": "pet-456",
        "exp": 50,
        "mutationPoints": 10
      }
    ],
    "logs": [
      "战斗胜利！",
      "获得 100 点经验！",
      "获得 50 金币！",
      "获得：低级灵核 x2"
    ]
  }
}
```

### 5.4 战斗AI行动

**接口**: `POST /api/v1/battle/:battleId/enemy-action`

**响应**:
```json
{
  "success": true,
  "data": {
    "result": {
      "actionType": "skill",
      "skillId": "S001",
      "damage": 18
    },
    "state": {
      // 更新后的战斗状态
    },
    "logs": [
      {
        "id": "log-5",
        "round": 1,
        "source": "enemy",
        "type": "skill",
        "message": "野生的月光狐 使用了 月光！",
        "timestamp": "2026-01-04T10:00:02Z"
      }
    ]
  }
}
```

---

## 6. 探索接口

### 6.1 获取地图节点

**接口**: `GET /api/v1/exploration/maps`

**响应**:
```json
{
  "success": true,
  "data": {
    "maps": [
      {
        "id": "map-001",
        "name": "新月之地",
        "description": "充满灵气的森林，适合新手探索。",
        "level": "新手",
        "requiredLevel": "魂徒",
        "unlocked": true,
        "nodes": [
          {
            "id": "node-001",
            "name": "森林入口",
            "description": "新月之地的入口区域。",
            "encounterRate": 0.3,
            "possibleEncounters": ["1001", "1002", "3001"]
          },
          {
            "id": "node-002",
            "name": "月光湖畔",
            "description": "月光狐经常出没的地方。",
            "encounterRate": 0.5,
            "possibleEncounters": ["1001", "1002"]
          }
        ]
      },
      {
        "id": "map-002",
        "name": "囚岛",
        "description": "危险的监狱岛屿，关押着强大的魂宠。",
        "level": "进阶",
        "requiredLevel": "魂师",
        "unlocked": false
      }
    ]
  }
}
```

### 6.2 探索节点

**接口**: `POST /api/v1/exploration/explore`

**请求体**:
```json
{
  "nodeId": "node-001",
  "action": "search"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "eventType": "encounter",
    "event": {
      "type": "battle",
      "description": "遇到了野生的月光狐！",
      "enemyPet": {
        "uid": "pet-789",
        "speciesId": "1001",
        "name": "野生的月光狐",
        "level": 5
      },
      "canCapture": true,
      "captureRate": 0.4
    },
    "logs": [
      "你在森林中仔细搜寻...",
      "突然，一只野生的月光狐出现了！"
    ]
  }
}
```

### 6.3 触发随机事件

**接口**: `POST /api/v1/exploration/random-event`

**响应**:
```json
{
  "success": true,
  "data": {
    "eventType": "treasure",
    "event": {
      "type": "treasure",
      "description": "发现了一个宝箱！",
      "rewards": {
        "gold": 100,
        "items": [
          {
            "itemId": "item-003",
            "name": "进化石",
            "quantity": 1
          }
        ]
      }
    }
  }
}
```

---

## 7. 存档接口

### 7.1 保存游戏

**接口**: `POST /api/v1/save`

**请求体**:
```json
{
  "saveName": "进度1",
  "saveData": {
    "player": {
      "id": "player-123",
      "name": "楚暮"
    },
    "pets": [
      {
        "uid": "pet-456",
        "speciesId": "1001",
        "level": 5
      }
    ],
    "progress": {
      "currentMap": "map-001",
      "completedQuests": []
    }
  }
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "saveId": "save-123",
    "saveName": "进度1",
    "timestamp": "2026-01-04T10:00:00Z"
  }
}
```

### 7.2 加载存档

**接口**: `GET /api/v1/save/:saveId`

**响应**:
```json
{
  "success": true,
  "data": {
    "saveId": "save-123",
    "saveName": "进度1",
    "saveData": {
      "player": {
        "id": "player-123",
        "name": "楚暮"
      },
      "pets": [...],
      "progress": {...}
    },
    "timestamp": "2026-01-04T10:00:00Z"
  }
}
```

### 7.3 获取存档列表

**接口**: `GET /api/v1/saves/list`

**响应**:
```json
{
  "success": true,
  "data": {
    "saves": [
      {
        "saveId": "save-123",
        "saveName": "进度1",
        "playerName": "楚暮",
        "playerLevel": "魂士",
        "timestamp": "2026-01-04T10:00:00Z",
        "screenshot": "https://..."
      },
      {
        "saveId": "save-124",
        "saveName": "进度2",
        "playerName": "楚暮",
        "playerLevel": "魂师",
        "timestamp": "2026-01-03T15:30:00Z",
        "screenshot": "https://..."
      }
    ]
  }
}
```

### 7.4 删除存档

**接口**: `DELETE /api/v1/save/:saveId`

**响应**:
```json
{
  "success": true,
  "message": "存档已删除"
}
```

---

## 8. 图鉴接口

### 8.1 获取魂宠图鉴

**接口**: `GET /api/v1/dex/pets`

**查询参数**:
- `rank`: 种族等级 (可选)
- `element`: 属性 (可选)
- `page`: 页码
- `pageSize`: 每页数量

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "1001",
        "name": "月光狐",
        "rank": "奴仆级",
        "elements": ["妖灵"],
        "description": "一种高贵的狐族魂宠...",
        "baseStats": {
          "health": 60,
          "stamina": 80,
          "attack": 15,
          "defense": 10,
          "speed": 25
        },
        "skills": ["S001", "S003"],
        "unlocked": true,
        "captured": true
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 11,
      "totalPages": 1
    }
  }
}
```

### 8.2 获取技能图鉴

**接口**: `GET /api/v1/dex/skills`

**查询参数**:
- `element`: 属性 (可选)
- `type`: 类型 (可选)

**响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "S001",
        "name": "月光",
        "element": "妖灵",
        "type": "辅助",
        "power": 0,
        "cost": 5,
        "accuracy": 100,
        "description": "沐浴月光，缓慢恢复体力。",
        "unlocked": true
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 16,
      "totalPages": 1
    }
  }
}
```

---

## 9. 错误代码

### 9.1 错误代码表

| 代码 | 说明 | HTTP状态 |
|------|------|----------|
| `INVALID_PARAMS` | 参数验证失败 | 400 |
| `INVALID_TOKEN` | Token 无效 | 401 |
| `TOKEN_EXPIRED` | Token 过期 | 401 |
| `DUPLICATE_NAME` | 昵称已存在 | 409 |
| `RESOURCE_NOT_FOUND` | 资源不存在 | 404 |
| `INSUFFICIENT_PERMISSION` | 权限不足 | 403 |
| `INSUFFICIENT_SOUL_POWER` | 魂力不足 | 422 |
| `INSUFFICIENT_RESOURCES` | 资源不足 | 422 |
| `PET_NOT_LEARNED_SKILL` | 魂宠未学习技能 | 422 |
| `EVOLUTION_CONDITION_NOT_MET` | 异变条件未满足 | 422 |
| `BATTLE_NOT_ACTIVE` | 战斗未开始 | 422 |
| `NOT_PLAYER_TURN` | 不是玩家回合 | 422 |
| `RATE_LIMIT_EXCEEDED` | 超过限流 | 429 |
| `INTERNAL_ERROR` | 内部错误 | 500 |

---

**文档版本**: v1.0
**创建日期**: 2026-01-04
**维护人员**: 后端团队
**基础路径**: `/api/v1`
