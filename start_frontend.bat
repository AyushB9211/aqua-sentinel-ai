@echo off
title SeaSentinel AI - Frontend
cd /d "%~dp0frontend"
echo ===================================================
echo Starting SeaSentinel AI Frontend (Vite + React)
echo URL: http://localhost:3000
echo ===================================================
call npm.cmd run dev
pause
