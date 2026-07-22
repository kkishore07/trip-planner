@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO off
@TITLE Maven Wrapper

@SETLOCAL LEAVE_ARG_ERRORS

SET ERROR_CODE=0

@REM To isolate internal variables from possible post scripts, we use a localized environment
SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
IF "%MAVEN_PROJECTBASEDIR%"=="" SET MAVEN_PROJECTBASEDIR=%~dp0

SET MAVEN_CONFIG=%MAVEN_PROJECTBASEDIR%\.mvn

@REM Find maven.config
IF NOT EXIST "%MAVEN_CONFIG%\maven.config" GOTO noMavenConfig
FOR /F "usebackq delims=" %%i IN ("%MAVEN_CONFIG%\maven.config") DO SET MAVEN_CMD_LINE_ARGS=%%i %MAVEN_CMD_LINE_ARGS%
:noMavenConfig

@REM Execute Maven
mvn %*
IF %ERRORLEVEL% NEQ 0 SET ERROR_CODE=%ERRORLEVEL%

:end
@REM set local scope for the ERROR_CODE variable
EXIT /B %ERROR_CODE%
