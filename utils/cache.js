var fs = require('fs');
var path = require('path');
var gameData = require('./gameData');

var logger = require('./logger');
var filePath = path.join(__dirname, './cache.json');//C:\Users\PC\Desktop\脚本双开\自定义\utils\cache.json
// 基础配置
var CACHE = {
    'DEBUG': false, // 开关调试日志记录
    'refreshShopAdvert': true, // 自动点击商店广告刷新免费商品，领取奖励
    'openId': '',
    'room': {
        'openId': '',
        'roomKey': ''
    },
    'autoPlay': {
        'enable': true, // 启用自动游戏
        'pvpType': false,   // pvp竞技 - 优先顺序：3
        'cooperateType': false,  // 合作 - 优先顺序：1
        'cooperateRoomType': false,  // 合作/开房进房 - 优先顺序：1
        'arenaType': false,  // 竞技场 - 优先顺序：2 - 可能一直刷下去，如果想刷 pvp 关闭设置 false
        'sjcTry': false,  // 孙进超测试
    },

    'version': {}, // 版本相关信息
    'mailList': [], // 邮箱数据
    'gonggaoBoard': {}, // 公告数据
    'honorTokenInfo': {}, // 荣誉令牌信息
    'chatList': [], // 聊天记录
    'friendList': [], // 好友列表
    'LegionData': { myLegionInfo: {}, membersInfo: [] }, // 军团数据
    'LegionGoalData': {}, // 军团的目标数据
    'arenaData': {}, // 竞技场数据
    // 用户信息
    'userInfo': {
        "vsIdTTimes": 0,
        "maxWinCombo": 0,
        "createTS": 0,
        "maxHonor": 0,
        "win": 0,
        "uid": 0,
        "icon": 0,
        "iconFrame": 0,
        "sex": 0,
        "vserverId": 0,
        "maxRound": 0,
        "region": 0,
        "grade": 0,
        "honor": 0,
        "avatar": "",
        "exp": 0,
        "gold": 0,
        "diamond": 0,
        "name": "姓名",
        "lose": 0
    },
    'loginInfo': {}, // 登录信息
    // 对局信息
    'battle': {
        /*BattleConst.BossType = {
            Knight = 101,	-- 骑士（转王）
            Magician = 102,	-- 魔术师
            Imprison = 103,	-- 禁锢
            Summoner = 104,	-- 召唤师
            Assassinator = 105,	-- 暗杀大师
        }*/
        bossType: {
            Knight: 101,	// 骑士（转王）
            Magician: 102,	// 魔术师
            Imprison: 103,	// 禁锢
            Summoner: 104,	// 召唤师
            Assassinator: 105,	// 暗杀大师
        },
        bossTrailer: 0, // boss 预告
        battleType: 0, // 对战类型：1.正常排位 2.合作模式 3.竞技场
        runTimeLeft: -1, // 登录游戏时间
        runTimeInterval: 100, // 游戏帧处理间隔
        killBallMergeTime: -1, // 抢救球球 时间
        // 我方玩家 信息
        self: {
            cfg: {},
            ballMaxNum: 15,
            ballList: {},
            ballsGrade: {}
        }
    },
    'ads_can': {},
    'adsWatchCnt': 0,  // 每日广告播放次数
    'dragonBallInfo': {}, // 龙珠信息
    // 广告类型
    'AdvertData': {
        'shopAdvertType': 1,  // 商店
        'pvpAdvertType': 2,   // 竞技
        'cooperateAdvertType': 3,  // 合作
        'getRewardAdvertType': 4,  // 支援宝箱
        'missionAdvertType': 5,  // 任务
        'legionContributeAdvertType': 6,  // 球队捐献广告
        'shopAdvertLimit': false, // 商店广告限制
        'hasVideoAdsBuff': true, // 竞技BUFF
        'cooperateAdvertLimit': false // 合作广告限制
    },

    '_advertList': {},
    '_curNum': 0, // 当前龙珠数
    '_vipType': 0, // 0是免费。1是vip
    '_times': 0, // 当前刷新次数
    '_curTime': 0, // 剩余刷新时间
    '_rewardBuffInfo': {
        "state": 0, //==1 合作模式双倍奖励buff是否激活
        "totalCnt": 0, //3 双倍奖励总次数
        "dayRemainCnt": 0 //3 双倍奖励剩余可用次数
    },
    '_noticeList': [], // 通用广告
    '_cheapPackIsOpen': false, // 1元礼包。6元礼包
    '_cheapPackData': [], // 1元礼包。6元礼包
    '_AbnormalFunction': false,
    '_AbnormalFunctionTime': 0
};

// 多玩家数据池
var CACHE_LSIT = {};

// 取所有用户缓存
CACHE.getAllCACHE = function () {
    return CACHE_LSIT;
};

// 取 openid 对应配置
CACHE.getUserCache = function (openId) {
    var usercache = CACHE_LSIT[openId];
    if (!usercache) {
        usercache = JSON.parse(JSON.stringify(CACHE));
        userCacheInit(usercache, openId);
        CACHE_LSIT[openId] = usercache;
    }
    return usercache;
};

// 初始化玩家数据内置函数
function userCacheInit(CACHE, openId) {
    CACHE.openId = openId;

    // 创建玩家空白节点
    CACHE.clearPlay = function () {
        CACHE.battle.self.ballList = {};
    };
    /**
     * 根据 ID 取 缓存数据中的球球对象
     * @param {number} ballId
     * @returns { {ballId: number, ballType: number, pos: number, star: number} }
     */
    CACHE.getBallById = function (ballId) {
        /*{
            ballId: ballId, // 球球创建ID
            ballType: ballType, // 球球ID
            ballName: 'xxxxx', // 球球名称
            pos: pos, // 棋盘坐标
            star: ballInfo.star // 球球星级
        }*/
        return CACHE.battle.self.ballList[ballId];
    };

    // 合并球球判断 - 根据传入球球 ID 查询相同类型同等级的球球
    CACHE.getBallMergeId = function (ballId, isKillBall, bossComeType) {
        var mergeFromObj = CACHE.getBallById(ballId);
        var mergeFromObjIsAllPowerfulBall = gameData.BattleConst.allPowerful.includes(mergeFromObj.ballType); // 合并球球是否万能球球
        var mergeToObj = null;
        var ballList = CACHE.battle.self.ballList;

        // 如果是7星球球  并且是复制球   寻找输出球 成为其复制
        /*if (mergeFromObj.star >= 7 && mergeFromObj.ballType == 44) {
            //遍历所有球  查看是否有输出攻击类型球球复制
            var attackBall = Object.values(ballList).filter((ballItem) => {
                if (ballId !== ballItem.ballId
                    && ballItem.ballType !== mergeFromObj.ballType
                    && ballItem.star === mergeFromObj.star
                    && [24, 28, 34, 37, 38, 47, 50].includes(ballItem.ballType)) {
                    return true;
                }
            });
            if (attackBall.length > 0) {
                return attackBall[0];
            }
        } else if (mergeFromObj.star >= 7) {//否则不处理
            return;
        }*/
        //遇到暗杀BOSS 或者变化BOSS 特殊处理
        /*if (bossComeType == 101) {//变化BOSS  只复制 不合并
            if (!isKillBall && [44].includes(mergeFromObj.ballType)) {
                var hasCopyBall = Object.values(ballList).filter((ballItem) => {
                    // 找出复制球球 进行复制
                    if (ballId !== ballItem.ballId
                        && ballItem.ballType !== mergeFromObj.ballType
                        && ballItem.star === mergeFromObj.star
                        && [47, 32].includes(ballItem.ballType)) {
                        return true;
                    }
                });
                if (hasCopyBall.length > 0) {
                    return hasCopyBall[0];
                }
            }
            return;
        }*/
        // 成长球球 非暗杀模式，还是会尝试抢救！32.成长 44.复制
        // if (!isKillBall && [32, 44].includes(mergeFromObj.ballType)) {
        //     var hasCopyBall = Object.values(ballList).filter((ballItem) => {
        //         // 找出复制球球、生长球球 进行复制
        //         if (ballId !== ballItem.ballId
        //             && ballItem.ballType !== mergeFromObj.ballType
        //             && ballItem.star === mergeFromObj.star
        //             && [32, 44].includes(ballItem.ballType)) {
        //             return true;
        //         }
        //     });
        //     if (hasCopyBall.length > 0) {
        //         return hasCopyBall[0];
        //     }
        // }
        // 暗杀抢救模式 且 复制球球，需要变更为 合并同类，挪坑才能防止掉星。
        if (isKillBall && mergeFromObj.ballType === 44) {
            mergeFromObjIsAllPowerfulBall = false;
        }
        var canMergeList = Object.values(ballList).filter((ballItem) => {
            var result = false,
                mergeToObjIsAllPowerfulBall = false;
            if (ballId !== ballItem.ballId) {
                //棋盘不满 生星球不进行自我合并
                if (mergeFromObj.ballType === 39 && ballItem.ballType == 39 && ballList.length < CACHE.battle.self.ballMaxNum - 1) {
                    return false;
                }
                // （万能球 或 相同球） 且 星星相同
                if (ballItem.star === mergeFromObj.star) {
                    //棋盘不满情况下 升星不进行自我合并  并且6星升星球不进行自我合并
                    if (mergeFromObj.ballType === 39 && ballItem.ballType === 39) {
                        if (mergeFromObj.star == 6 && ballItem.star == 6) {
                            return false;
                        } else {
                            if (ballItem.ballType == 39 && ballList.length < CACHE.battle.self.ballMaxNum - 1) {
                                return false;
                            }
                        }
                    }
                    //同是成长球球 不合并
                    if (mergeFromObj.ballType === 32 && ballItem.ballType === 32) {
                        return false;
                    }
                    // 升星球球不给成长合并
                    if (mergeFromObj.ballType === 39 && ballItem.ballType === 32) {
                        return false;
                    }
                    // 升星球球不给合体合并 sjc
                    if (mergeFromObj.ballType === 39 && ballItem.ballType === 20) {
                        return false;
                    }
                    // 合体球球不给复制合并 sjc
                    if (mergeFromObj.ballType === 20 && ballItem.ballType === 44) {
                        return false;
                    }
                    // 合体球球不给升星合并 sjc
                    if (mergeFromObj.ballType === 20 && ballItem.ballType === 39) {
                        return false;
                    }
                    // 合体球球不给成长合并 sjc
                    if (mergeFromObj.ballType === 20 && ballItem.ballType === 32) {
                        return false;
                    }

                    // 被合并球球是 万能合并球球
                    mergeToObjIsAllPowerfulBall = gameData.BattleConst.allPowerful.includes(ballItem.ballType);
                    // 暗杀模式 且 被合并球球是复制球球，忽略
                    if (isKillBall && ballItem.ballType === 44) {
                        mergeToObjIsAllPowerfulBall = false;
                    }
                    // 非暗杀
                    if (!isKillBall) {
                        // 两球相同
                        if (mergeFromObj.ballType === ballItem.ballType) {
                            // 不相互合并 球球
                            if ([
                                32, // 成长球球
                                44, // 复制球球
                                39, // 升星球球
                            ].includes(ballItem.ballType)) {
                                return false;
                            }
                        }
                        // 六星球球 特殊判断
                        if (ballItem.star === 6) {
                            // 升星不处理球球
                            var handleBall = [mergeFromObj.ballType, ballItem.ballType];
                            // 合并球球中有一个是升星
                            if (handleBall.includes(39)) {
                                // 六星不需要升星球球列表
                                var notMergeList = [
                                    20, // 合体球球
                                    32, // 成长球球
                                    33, // 繁衍球球
                                    44, // 复制球球
                                ];
                                for (var i = 0; i < notMergeList.length; i++) {
                                    if (handleBall.includes(notMergeList[i])) {
                                        return false;
                                    }
                                }
                            }
                        } else if (ballItem.star === 7) {
                            if (mergeFromObj.ballType === 44) {
                                // 七星球球特殊判断
                                var aBallObj = gameData.getBallObj(ballItem.ballType);
                                // 七星复制，只与攻击类球球合并
                                //[24, 28, 34, 37, 38, 47, 50].includes(ballItem.ballType)
                                if (aBallObj.featureType === 1) {
                                    return true
                                } else {
                                    return false;
                                }
                            }

                            return false;

                        }
                    }
                    // 主球球 是万能球
                    if (mergeFromObjIsAllPowerfulBall || mergeToObjIsAllPowerfulBall) {
                        // 合并方是万能球
                        if (mergeFromObjIsAllPowerfulBall) {
                            // 39.升星球球 不合并 33.繁衍球球
                            // if(mergeFromObj.ballType === 39 && ballItem.ballType === 33) {
                            //     return false;
                            // }
                        } else if (mergeToObjIsAllPowerfulBall) { // 被合并方是万能球
                            // 33.繁衍球球 不合并 39.升星球球
                            // if(mergeFromObj.ballType === 33 && ballItem.ballType === 39) {
                            //     return false;
                            // }
                        }
                        result = true;
                    }
                    // 球球类型相同
                    if (ballItem.ballType === mergeFromObj.ballType) {
                        result = true;
                    }
                }
            }
            return result;
        });
        if (canMergeList.length > 0) {
            canMergeList.sort((a, b) => {
                var aBallObj = gameData.getBallObj(a.ballType);
                var bBallObj = gameData.getBallObj(b.ballType);
                a.weight = gameData.BattleConst.featureWeight[aBallObj.featureType];
                b.weight = gameData.BattleConst.featureWeight[bBallObj.featureType];
                return a.weight - b.weight;
            });
            mergeToObj = canMergeList[0];
        }
        return mergeToObj;
    };

    // 排序球球列表 - 根据 球球星星
    CACHE.getBallKeysSort = function () {
        var ballList = Object.values(CACHE.battle.self.ballList);
        // var hasCombo = ballList.filter( (ballItem) => {
        //     // 连击球球
        //     if(ballItem.ballType === 47) {
        //         return true;
        //     }
        // });
        ballList.sort((a, b) => {
            return a.star - b.star; // 排序：低到高 - 升序
            // 暗杀大师、合作模式 优先升级低星球球
            if (CACHE.battle.bossTrailer == 105
                || CACHE.battle.battleType === 2
                || hasCombo.length > 0) {
                return a.star - b.star; // 排序：低到高 - 升序
            } else {
                return b.star - a.star; // 排序：高到低 - 降序
            }
        });
        return ballList.map((ballItem) => ballItem.ballId); // 取球球实例 ID 数组
    };
}

// 读入文件到缓存
CACHE.readCache = function () {
    return; // 废弃
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            // 可能文件不存在之类的错误
            // console.error(err);
            return;
        }
        var json = JSON.parse(data);
        Object.assign(CACHE, json);
    });
};

// 缓存到文件数据
CACHE.saveCache = function () {
    var t_filePath = path.join(__dirname, './cache_' + Date.now() + '.json');
    // 清空内容
    fs.writeFile(t_filePath, JSON.stringify(CACHE_LSIT), function (err) {
        if (err) {
            console.log(err);
        }
    });
};

// 读取缓存还原数据
CACHE.readCache();

module.exports = CACHE;