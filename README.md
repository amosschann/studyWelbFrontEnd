use npx expo start to start expo - expo start deprecated


LOCAL BUILD INSTALLATION INSTRUCTIONS
1. install patch package - npm install -g patch-package
2. ensure that patches folder is in the main dir
3. install npm packages - npm i
4. install patch - npx patch-package
5. start expo - npx expo start


Take Note:
- Env var needs to start with EXPO_PUBLIC_ for it to work on expo env

- Local development for expo requires the use of Port Mapping / local ip address 
    - https://stackoverflow.com/questions/33704130/react-native-android-fetch-failing-on-connection-to-local-api
