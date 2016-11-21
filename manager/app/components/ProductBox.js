/**
 * Created by Riven on 2016/11/15.
 */

import React from 'react';
import cookie from 'react-cookie';
export default class ProductBox extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      userName:cookie.load('userName')
    }
  }

  render() {
    return (
      <div>
        hello,{this.state.userName}
      </div>
    );
  }
}
