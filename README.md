# 随便翻译器

一个简单易用的 Chrome 扩展，可以快速翻译网页上选中的英文文本。

## 使用方法

1. 在网页上选中需要翻译的英文文本
2. 点击出现的翻译图标
3. 查看翻译结果

![video](/video/翻译示例.gif)

## 安装前准备

在使用此扩展之前，你需要：

1. 注册[百度翻译开放平台](http://api.fanyi.baidu.com/api/trans/product/desktop)账号



2. 创建应用获取 APPID 和密钥
3. 修改 `background.js` 中的 APPID 和 KEY：

javascript
const APPID = '替换成你的APPID';
const KEY = '替换成你的密钥';

## 安装方法

1. 下载本项目代码
2. 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目文件夹

## 功能特点

- 简单易用的界面
- 快速响应
- 准确的翻译结果

## 注意事项

- 请确保已正确配置百度翻译 API 的 APPID 和密钥
- 百度翻译 API 有调用频率限制，请合理使用
- 如遇到问题，请查看浏览器控制台的错误信息


