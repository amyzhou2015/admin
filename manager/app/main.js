/**
 * Created by Riven on 2016/11/15.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router';
import Navigation from './components/Navigation';
import ProductBox from './components/ProductBox';
import "antd/dist/antd.less";

const controlPanel = React.createClass({
    render() {
        return <h3> controlPanel </h3>
    }
})

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h3> About </h3>
    }
}


ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Navigation}>
            <IndexRoute component={ProductBox}/>
            <Route path="modifyPassword" params={{"menu": "sub1-1"}} component={About}/>
            <Route path="controlPanel" params={{"menu": "sub1"}} component={controlPanel}/>
            <Route path="*" params={{"menu": "sub1"}} component={ProductBox}/>
        </Route>
    </Router>, document.getElementById('content'));

