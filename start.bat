@echo off
title MID Code Generator Server
echo Starting MID Code Generator...
echo.
echo The server will start on http://localhost:3005
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python -m http.server 3005 2>nul
if %errorlevel% neq 0 (
    echo Python 3 not found, trying Python 2...
    python -m SimpleHTTPServer 3005 2>nul
    if %errorlevel% neq 0 (
        echo Error: Python is not installed or not in PATH
        echo Please install Python or use another method to start the server
        pause
        exit /b 1
    )
)

pause 