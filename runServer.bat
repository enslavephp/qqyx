
@Echo Off
TITLE ����Ӣ�۸���
:start
CLS
COLOR 0a
:: ʹ��COLOR����Կ���̨�����ɫ���и���
mode con cols=70 lines=30
:: MODE���Ϊ�趨����Ŀ�͸�

:sc_main
echo.&echo.
echo       -------------- [ ѡ������ģʽ ] --------------
echo.&echo.
echo             0.������ʼ�� npm install & echo.
echo             1.Ĭ��ģʽ������ģʽ������PVP�� & echo.
echo             2.����ģʽ & echo.
echo             3.����PVP & echo.
echo             4.������ & echo.
echo             5.����ģʽ�����н�����Ϸ�� & echo.
echo             6.����ģʽ������ģʽ 2�ˣ� & echo.
echo             7.��������ԣ�����ģʽ 1�ˣ� & echo.
echo.&echo.
echo             q.�˳� & echo.&echo.&echo.&echo.&echo.&echo.
set "select="
set /p select= �������֣����س����� :
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

:: ������ʼ��
:sc_run0
cls
echo ���ڳ�ʼ�����������Ժ�
mode con cols=100 lines=30
npm install
PAUSE >nul
Goto sc_main

:: Ĭ��ģʽ������ģʽ������PVP��
:sc_run1
cls
echo ���������У����Ժ�
mode con cols=100 lines=30
node index.js
PAUSE >nul
Goto sc_main

:: ����ģʽ
:sc_run2
cls
echo ���������У����Ժ�
mode con cols=100 lines=30
node index.js cooperateType
PAUSE >nul
Goto sc_main

:: ����PVP
:sc_run3
cls
echo ���������У����Ժ�
mode con cols=100 lines=30
node index.js pvpType
PAUSE >nul
Goto sc_main

:: ������
:sc_run4
cls
echo ���������У����Ժ�
mode con cols=100 lines=30
node index.js arenaType
PAUSE >nul
Goto sc_main

:: ����ģʽ�����н�����Ϸ��
:sc_run5
cls
echo ���������У����Ժ�
mode con cols=100 lines=30
node index.js notAuto
PAUSE >nul
Goto sc_main

:: ����ģʽ
:sc_run6
cls
echo ���������У����Ժ�
mode con cols=100 lines=30
node index.js cooperateRoomType
PAUSE >nul
Goto sc_main

:: ����ģʽ
:sc_run7
cls
echo ���������ģʽ��������
mode con cols=100 lines=100
node index.js sjc
PAUSE >nul
Goto sc_main
