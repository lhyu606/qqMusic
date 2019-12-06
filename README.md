# mp-proj

> A Mpvue project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

说明：
1、小程序开始运行直到第一页出现之前，所有的 vue 实例就已经被创建，也就是说所有的 created() 都被执行，故一些代码放在 mounted () 里执行