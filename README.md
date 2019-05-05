# 记一次对webpack4.x的尝试

>之前一直未对webpack有过从零配置的学习，这次新项目需构建多页面的静态页面所以有机会来尝试一下

## 开始
1. 构建目录结构如下图。
![images](https://github.com/sky-hu-10/bargain_static/blob/master/images/catalogue.png)
2. webpack4.x新特性。
<<<<<<< HEAD
   >不再是webpack单独使用,4.x需要配合webpack一起使用
=======
   >不再是webpack单独使用,4.x需要配合webpack一起使用
>>>>>>> d60d1709c11fb9fcd3bd2bdc1f7df9fcb8ebf19f

   >webpack4.x提供一个mode的配置选择区分默认配置。mode分为development/production/none。webpack运行时会根据mode设置一个全局变量process.env.NODE_ENV
3. 配置文件核心
   >利用node内的glob包遍历pages下js文件实现动态添加入口文件

   ``` js
    const glob = require('glob');//node模块检索本地文件
    function GetEntry(){
        var entry = {};
        glob.sync('./src/pages/**/*.js').forEach((name)=>{
            let n= name.split("/")[3];
            entry[n]=name;
        })
        return entry
    }
   ```

    >构建时每个页面js与html统一名，所以可根据遍历出来得入口文件构建多个htmlWebpackPlugin实列(用来生成html页面并引入对应js与css)

    ```javascript
        let entryObj = GetEntry();
        Object.keys(entryObj).forEach(item=>{
            module.exports.plugins.push(new HtmlWebpackPligin(GetHtml(item,entryObj[item])))
        })
    ```
4. 其他配置
    > css-loader，px2rem-loader，postcss-loader对css一些处理,转化rem，对css新特性添加浏览器前缀，postcss-loader需要创建一个postcss.config.js来进行具体配置
5. 第三方js包对引用
    >直接作为静态资源引用，在html内引用，然后静态资源复制直接复制到build文件夹下

    ```javascript
        new copyWebpackPlugin([{
            from:path.resolve(__dirname,"./src/plugin"),
            to:'./plugin',
            ignore:['.*']
        }]),
    ```

    >利用cdn来引入第三方js，首先在html内通过script引入，然后在对应js内引入并配置webpack.config.js

    ```js
        module.exports={
            /*外部文件不打包*/
            jquery: "jQuery",
        }
    ```
    >但第三方js有npm包时，可以npm安装包，然后利用expose-loader暴露为全局变量

    ```js
     module.exports = {
         module:{
             rules:[
                 {
                     test:require.resolve("jquery"),
                     use:'expose-loader?$',//jquery变为$暴露为全局变量
                 }
             ]
         }
     }
    ```

## 总结
  之前只有用到webpack，一直没机会自己从零配置一次，该项目由于为jsp，前端这边工作量相对较少。所有能边摸索边写。一轮下来对webpack也更了解一些。此次记录仅为自己的一次摸索与总结，如有错误欢迎交流。

