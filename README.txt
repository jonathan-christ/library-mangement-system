TO RUN ON MACHINE:
1) PREREQUISITES:
    1) MUST HAVE SQL DATABASE
        1.1) Make sure sql file creates database lms_db_temp
        1.2) Make sure database configurations are consistent 
            1.2.1) Check db.config -> /server/configs/db.config.js
            1.2.2) Update config to match with your system
    2) MAKE SURE NODE JS IS INSTALLED

2) ON BOTH SERVER AND CLIENT:
    2.1) Run on cmd NOT POWERSHELL
        - there is an error: ...running scripts are disabled on this system...
        - powershell immediately stops while cmd runs (nothing breaks)
        - so choose cmd :)
        2.1.1) RUN ON POWERSHELL (OPTIONAL/ALTERNATIVE):
            2.1.1.1) Open windows powershell
            2.1.1.2) Enter: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
                - RemoteSigned is deemed to be safer that Unrestricted
            2.1.1.3) Run on powershell
    2.2) Enter commands:
        2.2.1) npm i
        2.2.2) npm run dev
