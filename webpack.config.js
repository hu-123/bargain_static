const path = require('path');
const glob = require('glob');//node模块检索本地文件
let HtmlWebpackPligin = require('html-webpack-plugin');//分解js与html
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');//分解css与js
let copyWebpackPlugin = require('copy-webpack-plugin');//用到的静态资源不作处理直接生成到dist的指定文件夹内
let CleanWebpackPlugin = require('clean-webpack-plugin');
/**
 * 动态检索pages下入口文件
 */
function GetEntry(){
    var entry = {};
    glob.sync('./src/pages/**/*.js').forEach((name)=>{
        let n= name.split("/")[3];
        entry[n]=name;
    })
    return entry
}
/**
 * 动态添加html
 */
function GetHtml(name,src){
    return{
        template:`./src/pages/${name}/${name}.html`,
        filename:path.resolve(__dirname,`./build/${name}/${name}.html`),
        chunks: [`${name}`]
    }
}
module.exports = {
    entry: GetEntry(), // 入口文件
    output: {
        publicPath:'../',
        path: path.resolve('build'), // 必须使用绝对地址，输出文件夹
        filename: "js/[name].js" // 打包后输出文件的文件名
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            { //拆分成单个css
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract(
                    ['css-loader', 'px2rem-loader', 'postcss-loader']
                )
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        name:'images/[name]-[hash:5].[ext]',
                        publicPath:'../'
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {
                        bypassOnDebug:true
                    },
                }]
            }, {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextWebpackPlugin({
            filename: "css/[name].css", //制定编译后的目录
            allChunks: true, //把分割的块分别打包
        }),
        new copyWebpackPlugin([{
            from:path.resolve(__dirname,"./src/plugin"),
            to:'./plugin',
            ignore:['.*']
        }]),
        new CleanWebpackPlugin({
            root:path.resolve(__dirname,"../"),
            verbose:true,
            dry:false
        })
    ],
    externals: {
        jquery: "jQuery",
        distpicker:'distpicker'
      },
    devServer:{
        contentBase:path.join(__dirname,'dist'),
        compress:true,
        port:9000
    }
}
let entryObj = GetEntry();
Object.keys(entryObj).forEach(item=>{
    module.exports.plugins.push(new HtmlWebpackPligin(GetHtml(item,entryObj[item])))
})