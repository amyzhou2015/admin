/**
 * Created by Riven on 2016/12/7.
 */
import {isLoggedIn, otherEnterHookHere} from '../components/account/authentication.js';

module.exports = {
    getComponents(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('../components/ProductBox'))
        },'home')
    },
}