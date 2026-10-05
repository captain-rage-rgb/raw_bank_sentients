@echo off
title Rawbank Sentient — UC2 Investigation Copilot (Backend :8001)
cd /d "%~dp0backend"
echo [UC2] Starting FastAPI Copilot backend on http://127.0.0.1:8001 ...
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
pause
