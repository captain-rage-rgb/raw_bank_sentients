@echo off
title Rawbank Sentient - Use Case 02 Copilot Backend (Port 8001)
echo ================================================================
echo Starting Rawbank Sentient Fraud Copilot Backend on port 8001...
echo ================================================================
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
pause
