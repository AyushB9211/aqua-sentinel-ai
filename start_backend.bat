@echo off
title SeaSentinel AI - Backend
cd /d "%~dp0backend"
echo ===================================================
echo Starting SeaSentinel AI Backend (FastAPI + YOLO)
echo URL: http://127.0.0.1:8000
echo ===================================================
if exist "C:\SeaSentinelAI\training\.venv\Scripts\python.exe" (
    "C:\SeaSentinelAI\training\.venv\Scripts\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
) else (
    python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
)
pause
