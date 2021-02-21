var express = require('express');
var app = express();
var api = require('./lib/api');
var logger = require('./utils/logger');
var port = 8098;
var CACHE = require('./utils/cache');
var args = process.argv.splice(2); // 启动参数
//require('./socket');

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    logger("应用实例，访问地址为 http://%s:%s", host, port);

    initConfig(args[0]);
});

// 主页
app.get('/', function (req, res) {
    CACHE.saveCache(); // 缓存写到文件
    res.send(JSON.stringify(CACHE.getAllCACHE()));
});

// api
app.post('/api.php', api);

// 初始化模式
function initConfig(runMode) {
    CACHE.autoPlay.enable = true;
    CACHE.autoPlay.pvpType = false;
    CACHE.autoPlay.cooperateType = false;
    CACHE.autoPlay.arenaType = false;
    switch (runMode) {
        case 'cooperateType':
            logger("[运行模式] 合作模式");
            CACHE.autoPlay.cooperateType = true;
            break;
        case 'cooperateRoomType':
            logger("[运行模式] 合作模式/自动开房进房间");
            CACHE.autoPlay.cooperateRoomType = true;
            break;
        case 'pvpType':
            logger("[运行模式] 竞技PVP模式");
            CACHE.autoPlay.pvpType = true;
            break;
        case 'arenaType':
            logger("[运行模式] 竞技场模式");
            CACHE.autoPlay.arenaType = true;
            break;
        case 'notAuto':
            logger("[运行模式] 辅助模式");
        default:
            logger("[运行模式] 默认模式");
            CACHE.autoPlay.enable = false;
            CACHE.autoPlay.pvpType = true;
            CACHE.autoPlay.cooperateType = true;
            CACHE.autoPlay.arenaType = true;
    }
}