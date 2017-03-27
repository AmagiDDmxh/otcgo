let path = require('path');
let webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'build.min.js'
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					'scss': 'vue-style-loader!css-loader!sass-loader',
					'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
				}
			}
		}, {
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}, {
			test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
			exclude: /favicon\.png$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}]
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
		},{
			test: /\.styl$/,
			loader: 'stylus-loader',
			exclude: /node_modules/,
		}]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js'
		}
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		proxy: {
			'/api/*': {
				target: 'http://testnet.otcgo.cn/',
				secure: false,
				changeOrigin: true
			}
		},
		host: 'localhost',
		port: 3000
	},
	performance: {
		hints: false
	},
	devtool: '#source-map'
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#cheap-source-map';
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
