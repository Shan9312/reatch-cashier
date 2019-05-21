const path = require('path')

module.exports = {
    publicPath: process.env.PUBLIC_PATH || '/',
    chainWebpack: config => {
        // handle less
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))

        // modify html-webpack-plugin options
        config
            .plugin('html')
            .tap(args => {
                args[0].commonResourcePath = process.env.COMMON_RESOURCE_PATH // set common resource path
                return args
            })

    },
    devServer: {
        port: 8002, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    }

}

function addStyleResource(rule) {
    rule.use('less')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/styles/variable.less'),
                path.resolve(__dirname, './src/styles/mixin.less')
            ]
        })
}