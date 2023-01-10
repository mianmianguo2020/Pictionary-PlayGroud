# 你画我猜 

## 技术架构

- Vue + VueRouter +  **Vuex(核心)**

  作用: 便于多组件通信, 页面这里为了避免交叉操作, 页面组件只和 vuex 交互

- **Socket.IO (核心)**

  负责客户端 和 服务端交互, 将服务端拿到的数据存入 Vuex Store 中

- Konva （基于Canvas的绘图库）

  插件, 辅助开发

- element-ui (前端开发ui组件库)

  网页ui框架
  



## 启动服务器
   https://gitee.com/jepsonpp/draw-and-guess 下载服务器

`draw-server` 服务器目录

```bash
- 安装依赖
  yarn
  
- 启动接口
  yarn start
```



## 启动项目

`draw-and-guess` 完整代码目录

```txt
- 安装依赖
  yarn
  
- 启动项目
  yarn serve
```



## 其他说明

1. 添加自定义更换画笔颜色功能
2. 将自定义主题词功能修改为系统随机主题词(由于服务器未提供相关端口,词库仅暂存于vuex中)
3. 本项目参考自https://www.bilibili.com/video/BV12V41147TP?t=39&p=13 ,仅供学习使用