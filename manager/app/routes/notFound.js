/**
 * Created by Riven on 2016/12/7.
 */

module.exports = {
    path:'*',
    getComponents(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('../components/404').default)
        },'notFound')
    },
}