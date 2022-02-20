const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin')


module.exports = {
    mode: "production",
    entry: {
        "index": './src/index.ts',
        "styles/calendar": './src/styles/index.scss',
        "styles/themes/classic": './src/styles/themes/classic.scss'
    },
    optimization: {
        removeEmptyChunks: true,
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false, // To avoid separate file with licenses.
            terserOptions: {
                ecma: '2020',
                mangle: true,
                sourceMap: false,
                module: true,
                keep_classnames: /^NoteSheet$/,
                keep_fnames: false,
                toplevel: true,
            },
        })]
    },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /__mocks__|docs|dist|node_modules|\.test\.ts/,
            include: /src/,
            failOnError: true,
        }),
        new CopyPlugin({
            patterns: [
                { context: './src/', from : '**/*.json', to : './' },
                { context: './src/', from : '**/*.(hbs|html)', to : '[path][name].html' },
                { context: './', from : 'README.md', to : './' },
                { context: './', from : 'LICENSE', to : './' },
                { context: './docs', from : 'Configuration.md', to : './docs' },
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
