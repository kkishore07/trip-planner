@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   JourneyMate AI - Spring Boot Backend Launcher
echo ===================================================

:: Check if global mvn exists
where mvn >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Global Maven found. Starting Spring Boot Backend...
    mvn spring-boot:run
    goto :end
)

:: If not found globally, check local portable maven folder
set "LOCAL_MAVEN_DIR=%~dp0.maven-bin\apache-maven-3.9.6\bin"
if exist "!LOCAL_MAVEN_DIR!\mvn.cmd" (
    echo [INFO] Local Maven found in .maven-bin. Starting Spring Boot...
    "!LOCAL_MAVEN_DIR!\mvn.cmd" spring-boot:run
    goto :end
)

echo [INFO] Maven not found. Downloading portable Apache Maven 3.9.6...
powershell -Command "New-Item -ItemType Directory -Force -Path '%~dp0.maven-bin' | Out-Null"
powershell -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '%~dp0.maven-bin\maven.zip'"

echo [INFO] Extracting Maven...
powershell -Command "Expand-Archive -Path '%~dp0.maven-bin\maven.zip' -DestinationPath '%~dp0.maven-bin' -Force"

if exist "!LOCAL_MAVEN_DIR!\mvn.cmd" (
    echo [SUCCESS] Maven setup complete! Starting Spring Boot Backend...
    "!LOCAL_MAVEN_DIR!\mvn.cmd" spring-boot:run
) else (
    echo [ERROR] Failed to extract Maven. Please ensure internet connection or open in VS Code / IntelliJ.
)

:end
