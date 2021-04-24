# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/sahachide/ZenTS/compare/v0.4.0...v0.5.0) (2021-04-24)


### Features

* add request body validator ([570ec7b](https://github.com/sahachide/ZenTS/commit/570ec7b13f853225fdf7b2d3ac6b5df0833dbe4f))
* request body validation ([690a1ce](https://github.com/sahachide/ZenTS/commit/690a1cedff19197997fac6ca1f67e87032ae392f))

## [0.4.0](https://github.com/sahachide/ZenTS/compare/v0.3.0...v0.4.0) (2021-03-22)


### Features

* add email support with MJML and nunjucks engine (or just plain text) ([35544a3](https://github.com/sahachide/ZenTS/commit/35544a30c5fdda2f8943d42433c5b9015ec6d4f3))
* add email support with MJML and nunjucks engine (or just plain text) ([cb59d67](https://github.com/sahachide/ZenTS/commit/cb59d67180a4b5165ed4372c47f8fd9d9c8d87ba))

## [0.3.0](https://github.com/sahachide/ZenTS/compare/v0.2.0...v0.3.0) (2020-12-11)


### Features

* limit exported members to only useful properties ([a2d065b](https://github.com/sahachide/ZenTS/commit/a2d065b22aadadc9cac8e41331812a45de82fc37))
* **cookie:** allow expire to be given as ms (number) or string (time string) ([3984632](https://github.com/sahachide/ZenTS/commit/3984632cc58b470f21638649d71d00a1047ef970))
* add [@body](https://github.com/body) context annotation ([7701b76](https://github.com/sahachide/ZenTS/commit/7701b76b8f0417087b7b15e9b5eeed5baa199df5))
* add [@context](https://github.com/context) annotation ([ed7697b](https://github.com/sahachide/ZenTS/commit/ed7697bdbe0d0523e01bbd8d28f805e0b353586c))
* add [@cookie](https://github.com/cookie) context annotation ([3d5381f](https://github.com/sahachide/ZenTS/commit/3d5381f8e44d17747ecbf288e26ccfaa3e857d9a))
* add [@error](https://github.com/error) context annotation ([e140d65](https://github.com/sahachide/ZenTS/commit/e140d655e06102e38f14e534003379a003201403))
* add [@params](https://github.com/params) context annotation ([34f3a5e](https://github.com/sahachide/ZenTS/commit/34f3a5e7c2d7244335f5b4ca34657b72834a20b7))
* add [@query](https://github.com/query) context annotation ([1234ee8](https://github.com/sahachide/ZenTS/commit/1234ee86390922f24819fa383349edc2cf800b53))
* add [@request](https://github.com/request) and [@req](https://github.com/req) context annotation ([944b3d1](https://github.com/sahachide/ZenTS/commit/944b3d106328cc91dc6c0f4f9a7be326550296a2))
* add [@response](https://github.com/response) and [@res](https://github.com/res) context annotation ([c7a29ea](https://github.com/sahachide/ZenTS/commit/c7a29ead7b7fce761480cab7d7ec4e27ae4ad685))

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
