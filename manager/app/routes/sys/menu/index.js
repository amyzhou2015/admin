/**
 * Created by Riven on 2016/12/7.
 */

module.exports = {
    path:'/sys/editMenu',
    getComponents(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('./components/edit').default)
        },'menu')
    },
}