@echo off
title Deploy Portfolio to GitHub Pages
cd /d "C:\Users\savio\.gemini\antigravity\scratch\nandagopalan-portfolio"

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files\Git\ucrt64\bin;%PATH%"

echo ====================================================================
echo   Nandagopalan V - SOC Analyst Portfolio Deployment
echo   Repository: https://github.com/Nandagopalan2000/Nandagopalan2000.github.io
echo   Author: Nandagopalan-V (sit19cs120@sairamtap.edu.in)
echo   Branch: main
echo ====================================================================
echo.

echo Pushing portfolio to GitHub...
echo (If prompted, please sign in or approve Git Credential Manager)
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================================
    echo   SUCCESS! Your portfolio has been pushed to GitHub!
    echo   Your website will be live shortly at:
    echo   https://nandagopalan2000.github.io
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo   Push failed or requires token authentication.
    echo ====================================================================
)

echo.
pause
