/**
 * Created by Riven on 2016/12/7.
 */

module.exports = {
    path:'/cms/banner/PCbanner',
    getComponents(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('./components/pcBanner').default)
        },'banner')
    },
}