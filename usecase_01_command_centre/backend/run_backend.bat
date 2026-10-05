@echo off
title Rawbank Sentient - Use Case 01 Dashboard Backend (Port 8000)
echo ================================================================
echo Starting Rawbank Sentient Command Centre Backend on port 8000...
echo ================================================================
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
