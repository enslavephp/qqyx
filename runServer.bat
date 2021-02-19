
@Echo Off
TITLE 球球英雄辅助
:start
CLS
COLOR 0a
:: 使用COLOR命令对控制台输出颜色进行更改
mode con cols=70 lines=30
:: MODE语句为设定窗体的宽和高

:sc_main
echo.&echo.
echo       -------------- [ 选择启动模式 ] --------------
echo.&echo.
echo             0.环境初始化 npm install & echo.
echo             1.默认模式（合作模式、竞技PVP） & echo.
echo             2.合作模式 & echo.
echo             3.竞技PVP & echo.
echo             4.竞技场 & echo.
echo             5.辅助模式（自行进入游戏） & echo.
echo             6.开房模式（合作模式 2人） & echo.
echo             7.孙进超测试（测试模式 1人） & echo.
echo.&echo.
echo             q.退出 & echo.&echo.&echo.&echo.&echo.&echo.
set "select="
set /p select= 输入数字，按回车继续 :
if "%select%"=="0" (goto sc_run0)
if "%select%"=="1" (goto sc_run1)
if "%select%"=="2" (goto sc_run2)
if "%select%"=="3" (goto sc_run3)
if "%select%"=="4" (goto sc_run4)
if "%select%"=="5" (goto sc_run5)
if "%select%"=="6" (goto sc_run6)
if "%select%"=="7" (goto sc_run7)
if "%select%"=="Q" (goto sc_exit)

:sc_exit
exit
goto :eof

:: 环境初始化
:sc_run0
cls
echo 正在初始化环境，请稍候
mode con cols=100 lines=30
npm install
PAUSE >nul
Goto sc_main

:: 默认模式（合作模式、竞技PVP）
:sc_run1
cls
echo 正在启动中，请稍候
mode con cols=100 lines=30
node index.js
PAUSE >nul
Goto sc_main

:: 合作模式
:sc_run2
cls
echo 正在启动中，请稍候
mode con cols=100 lines=30
node index.js cooperateType
PAUSE >nul
Goto sc_main

:: 竞技PVP
:sc_run3
cls
echo 正在启动中，请稍候
mode con cols=100 lines=30
node index.js pvpType
PAUSE >nul
Goto sc_main

:: 竞技场
:sc_run4
cls
echo 正在启动中，请稍候
mode con cols=100 lines=30
node index.js arenaType
PAUSE >nul
Goto sc_main

:: 辅助模式（自行进入游戏）
:sc_run5
cls
echo 正在启动中，请稍候
mode con cols=100 lines=30
node index.js notAuto
PAUSE >nul
Goto sc_main

:: 开房模式
:sc_run6
cls
echo 正在启动中，请稍候
mode con cols=100 lines=30
node index.js cooperateRoomType
PAUSE >nul
Goto sc_main

:: 开房模式
:sc_run7
cls
echo 孙进超测试模式正在启动
mode con cols=100 lines=100
node index.js sjc
PAUSE >nul
Goto sc_main
