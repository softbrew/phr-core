module.exports = {
    target: 'node', // Build for NodeJS
    entry: {
        server: './src/index.js'
    },
    output: {
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(gulpfile.js|node_modules|dist)/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }]
    },
    debug: true,
    devtool: 'source-map'
};
