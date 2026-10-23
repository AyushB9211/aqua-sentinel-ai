@echo off
title SeaSentinel AI - Launcher
echo ===================================================
echo Starting SeaSentinel AI System Services...
echo ===================================================
start "SeaSentinel AI Backend" cmd /c "%~dp0start_backend.bat"
timeout /t 2 /nobreak >nul
start "SeaSentinel AI Frontend" cmd /c "%~dp0start_frontend.bat"
echo.
echo SeaSentinel AI services are starting!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo ===================================================
timeout /t 5
