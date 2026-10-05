@echo off
title Rawbank Sentient — UC1 Command Centre (Backend :8000)
cd /d "%~dp0backend"
echo [UC1] Starting FastAPI backend on http://127.0.0.1:8000 ...
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
