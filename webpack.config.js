var path = require('path'),
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production'

var scssExtract = isProd ? ExtractTextPlugin.extract({
				fallback: 'style-loader',
				//resolve-url-loader may be chained before sass-loader if necessary
				use: ['css-loader?minimize=true&importLoaders=2', 'postcss-loader', 'sass-loader']
			}): ['style-loader', 'css-loader?minimize=true&importLoaders=2', 'postcss-loader', 'sass-loader']

module.exports = {
	entry: './src/appWebpack.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/public')
	},
	module: {
		rules: [{
			test: /\.scss$/,
			use: scssExtract
		}, {
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		},{
			test:/\.vue/,
			loader: 'vue-loader',
			options:{
				loaders:{
					'scss': 'vue-style-loader!css-loader!sass-loader',
					'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
				}
			}
		}]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
			}
		})
	],
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	devServer: {
		contentBase: './src',
		historyApiFallback: true,
	},
	performance: {
		hints: false
	},
	devtool: 'eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
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
			},
			comments: false
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		})
	])
}