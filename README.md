# readme
## 安装
```
yarn install
```
## 开发测试
```
// 启动主进程
yarn electron:start:main
// 启动渲染进程
yarn electron:start:umi
```
## 打包
```
// 全部打包
yarn package:mac
// 仅代码打包
yarn electron:build
// 仅主进程代码打包
yarn electron:build:main
// 仅渲染进程代码打包
yarn electron:build:umi
```

## 其他
```
// 如果出现 electron依赖错误
yarn electron:fix
```