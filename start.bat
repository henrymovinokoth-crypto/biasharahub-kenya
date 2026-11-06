@echo off
title BiasharaHub Kenya - Henry Okoth
echo ========================================================
echo   Starting BiasharaHub Kenya Platform...
echo   M-Pesa Recipient: Henry Okoth (0181288331)
echo ========================================================
set "PATH=%LOCALAPPDATA%\nodejs;%PATH%"
start http://localhost:3000
node server.js
pause
