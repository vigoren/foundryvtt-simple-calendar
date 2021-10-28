const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    mode: "production",
    entry: {
        "index": './src/index.ts',
        "styles/calendar": './src/styles/index.scss'
    },
    optimization: {
        removeEmptyChunks: true,
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false, // To avoid separate file with licenses.
            terserOptions: {
                mangle: true,
                sourceMap: false,
                //keep_classnames: /^SCNoteCollection$|^SCNoteSheetShim$|^SCNoteSheet$|^SCNote$/,
                keep_fnames: false,
                toplevel: true,
            },
        })]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { context: './src/', from : '**/*.json', to : './' },
                { context: './src/', from : '**/*.html', to : './' },
                { context: './', from : 'README.md', to : './' },
                { context: './', from : 'LICENSE', to : './' },
                { context: './docs', from : 'Configuration.md', to : './docs' },
                { context: './docs', from : 'Macros.md', to : './docs' },
                { context: './docs', from : 'Notes.md', to : './docs' },
                { context: './docs', from : 'UpdatingDateTime.md', to : './docs' },
            ]
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader',
                        options: {
                            url: { filter: (url, resourcePath) => {return url.indexOf('/systems') !== 0;}
                            }
                        }
                    },
                    // Compiles Sass to CSS
                    'sass-loader'
                ],
            },
            {
                test: /\.svg$/,
                type: 'asset/source'
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
};
