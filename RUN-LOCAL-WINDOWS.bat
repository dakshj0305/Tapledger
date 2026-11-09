@echo off
setlocal
cd /d "%~dp0"
echo.
echo Voltura - Local preview
 echo Keep this window open while using the app.
echo Open: http://localhost:8000/
echo Stop the server with Ctrl+C.
echo.
where py >nul 2>&1
if %errorlevel%==0 (
  py -m http.server 8000
  goto :eof
)
where python >nul 2>&1
if %errorlevel%==0 (
  python -m http.server 8000
  goto :eof
)
echo Python was not found. Install Python 3 or use GitHub Pages HTTPS hosting.
pause
