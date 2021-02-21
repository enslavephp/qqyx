var echo = require('../utils/logger');
var CACHE_CLASS = require('../utils/cache');
var CACHE = null;
var timestamp = Date.parse(new Date());
// 代码集
var supportList = {
    // 服务器心跳
    'rpc_server_heartbeat': function() {
        var result = '',
            startType,
            startTypeName = ['', '竞技模式', '合作模式', '竞技场'];
        if(CACHE.autoPlay.enable && CACHE.battle.battleType === 0) {
            result += "server.rpc_server_battle_cooperate_activate_reward_buff();";
            if(CACHE.autoPlay.cooperateRoomType) {
                result += 'server.rpc_server_video_ads_click_watch(3,0);';
                // 是否可以开启双倍奖励
                if(CACHE._rewardBuffInfo.totalCnt > 0) { // 开通过双倍奖励
                    if(CACHE._rewardBuffInfo.dayRemainCnt > 0) { // 双倍奖励剩余可用次数
                        result += 'server.rpc_server_battle_cooperate_activate_reward_buff();';
                    }
                }
                // 合作模式 - 开房模式
                if(CACHE_CLASS.room.roomKey) {
                    if(CACHE_CLASS.room.openId !== CACHE.openId) {
                        // 加入房间
                        echo('[进入房间] ' + CACHE_CLASS.room.roomKey);
                        result += 'server.rpc_server_join_friend_room(2,' + CACHE_CLASS.room.roomKey + ');';
                    }
                } else {
                    // 开房
                    echo('[创建房间] OpenId:' + CACHE.openId);
                    result += 'server.rpc_server_create_friend_room(2);';
                }
            }else{
                // 非开房模式的自动匹配模式
                if(CACHE.autoPlay.cooperateType && CACHE._times > 0) {
                    startType = 2; // 合作模式
                } else {
                    if(CACHE.autoPlay.arenaType) {
                        startType = 3; // 竞技场
                    } else if(CACHE.autoPlay.pvpType && CACHE.AdvertData.cooperateAdvertLimit) {
                        startType = 1; // 竞技模式
                    }
                }
                if(startType) {
                    echo('[匹配游戏] ' + startTypeName[startType]);
                    result += 'server.rpc_server_start_game(' + startType + ')';
                }
            }
            return result;
        }
    },
    // 登录
    'rpc_server_login': function(data) {
        CACHE.loginInfo = data;
    },
    // 版本信息
    'rpc_server_version': function(appVer, codeVer, hash, channel) {
        // rpc_server_version(\"1.4.1\",\"1.1.9\",\"c43055b8d3d34b67d050a5e1fbd3e8dd\",\"db_20003\")
        CACHE.version = {
            appVer,
            codeVer,
            hash,
            channel
        };
    },
    // 获取 - 好友列表
    'rpc_server_friend_list': function() {},
    // 获取 - 我的军团
    'rpc_server_my_legion': function() {},
    // 获取 - 军团成员
    'rpc_server_legion_member': function(uid) {
        // rpc_server_legion_member("1255_1594286755_20098_10")
    },
    // 龙珠升级
    'rpc_server_dragon_ball_upgrade': function(dbType) {},
    // 设置卡组 - 共三个卡组，设置其中某个卡组球球列表，列表球球共5个
    'rpc_server_dragon_ball_set_deck': function(index, ballData) {
        // rpc_server_dragon_ball_set_deck(1,[37,29,28,32,44])
    },
    // 切换卡组
    'rpc_server_dragon_ball_switch_deck': function(index) {
        CACHE.dragonBallInfo.dragonBallDeckIndex = index + 1;
    },
    /**
     * 开始游戏
     * @param battleType - 1.正常排位 2.合作模式 3.竞技场
     */
    'rpc_server_start_game': function(battleType) {

    },
    // 购买物品
    'rpc_server_market_daily_special_buy': function(itemId) {

    },
    // 视频广告刷新信息
    'rpc_server_video_ads_refresh_info': function(adType) {},
    // 视频广告点击观看
    'rpc_server_video_ads_click_watch': function(adType, type) {},
    // 竞技场 - 选择龙珠
    'rpc_server_battle_arena_select_ball': function(dbType) {},
    // 竞技场 - 领取奖励
    'rpc_server_battle_arena_get_reward': function() {},
    // 任务 - 广告
    'rpc_server_daily_reward_get_reward': function() {},
    // 任务 - 分享
    'rpc_server_get_share_reward': function() {},
    // 删除好友
    'rpc_server_friend_add_res': function(uid, type) {},
    // 获取 - 战斗报告列表
    'rpc_server_battle_report_list': function(type) {
        // rpc_server_battle_report_list(0)
    },
    // 开合作宝箱
    'rpc_server_battle_cooperate_open_box': function(type) {
        // rpc_server_battle_cooperate_open_box()
    },
};
// 客户端 -> 服务器
function C_S(handleStr, openId) {
    CACHE = CACHE_CLASS.getUserCache(openId);
    var result, evalStr;
    if(new RegExp(Object.keys(supportList).join("|")).test(handleStr)) {
        CACHE.DEBUG && echo.log('[记录日志] [C_S] ' + handleStr + "\r\n");
        // 处理方法
        try{
            evalStr = "supportList." + handleStr;
            //echo("[Eval]", evalStr);
            result = eval(evalStr);
            if(result) {
                // echo('[C->S 处理代码]', handleStr, "\n[处理结果]", result);
            } else {
                result = "DEBUG = 4"; // 空代码执行
                // echo('[无法处理代码]', handleStr);
            }
        }catch (e) {
            echo('[不支持的执行代码]', handleStr, e.message);
        }
    } else {
        // 未处理
    }
    return result;
}

module.exports = C_S;