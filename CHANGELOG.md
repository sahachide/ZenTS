# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/sahachide/ZenTS/compare/v0.1.2...v0.2.0) (2020-10-19)


### Features

* add fs.readJson and fs.writeJson methods ([b4e02ec](https://github.com/sahachide/ZenTS/commit/b4e02ecc1782d816c88f0b1bf73e15bc65816a7a))
* add fs.sanitizeFilename method ([f4a4eff](https://github.com/sahachide/ZenTS/commit/f4a4eff04ce3fed235c5cc86043cf6c3577a2b9f))
* add redirect responses ([e4e4e0a](https://github.com/sahachide/ZenTS/commit/e4e4e0aadd82d0067b2f4803e6ba88741f3de8f6))
* add redis support ([c9ab4aa](https://github.com/sahachide/ZenTS/commit/c9ab4aa5f31e9c827eaf8245c0c9111e952a7a94))
* add user- and session management ([05c0677](https://github.com/sahachide/ZenTS/commit/05c0677216752b67f8342e3ee3328934dea91bde))
* added context generics for easier type hinting of request params, query and body ([5c7a652](https://github.com/sahachide/ZenTS/commit/5c7a6524c816658c21850902487a477bbd3c9d52))
* better request header handling ([f9b6952](https://github.com/sahachide/ZenTS/commit/f9b6952e8767a522ab52f4d9c19058ca8dfd2879))
* change fs.fs.readDirContentRecursive to fs.readDir and allow non recursive search ([77ac53d](https://github.com/sahachide/ZenTS/commit/77ac53d6962b2f949bdf7cfbe170e86271e440ce))

### [0.1.3](https://github.com/sahachide/ZenTS/compare/v0.1.2...v0.1.3) (2020-09-23)

- Missing build artifacts

### 0.1.2 (2020-09-23)

### Features

* ability to pass a config object to zen() method ([4070078](https://github.com/sahachide/ZenTS/commit/4070078948350e5fb574b96b7100e8307d5ce793))
* add destroy method to ZenApp ([b59c2e0](https://github.com/sahachide/ZenTS/commit/b59c2e044537c215a4c219dbadf1dba8999df06f))
* export QueryString interface ([c7f20ff](https://github.com/sahachide/ZenTS/commit/c7f20ff5e6ecc37fd8f3fd5e9bb98606164051b6))


### Bug Fixes

* ControllerFactory throws an error when a controller key isn't found ([a9c28dc](https://github.com/sahachide/ZenTS/commit/a9c28dca28f90198b17f25967a0d414f6c734962))
* default config not loaded sometimes ([d4e7971](https://github.com/sahachide/ZenTS/commit/d4e79715d28ed187520fd2280c3e5cd7155e266c))
* isObject util method returns true for Arrays ([f69fe3d](https://github.com/sahachide/ZenTS/commit/f69fe3de6eb481ef8989cb5b18065cc63e1160dd))
* PUT bodys aren't parsed ([1fa9979](https://github.com/sahachide/ZenTS/commit/1fa9979e808130a6430def1b96ac420696c9dd49))
* simple cookies aren't parsed ([2fafd34](https://github.com/sahachide/ZenTS/commit/2fafd346c5ba91afc71bce682a8eb6f087a61063))
