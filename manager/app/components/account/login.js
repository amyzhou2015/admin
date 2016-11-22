/**
 * Created by Riven on 2016/11/21.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'react-cookie';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const login = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var now = new Date();
        var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 8, now.getUTCMinutes() + 15, now.getUTCSeconds());
        cookie.save('userName', values.userName, {path: "/", expires: now_utc});
        window.location.reload();
        console.log('Received values of form: ', values);
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    const mt = (document.documentElement.clientHeight-250)/2.4;
    return (
      <div className="login-box">
        <Form onSubmit={this.handleSubmit} style={{marginTop:mt}} className="login-form">
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{required: true, message: 'Please input your username!'}],
            })(
              <Input addonBefore={<Icon type="user" />} placeholder="Username"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input your Password!'}],
            })(
              <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox style={{color:"#ffffff"}}>记住密码</Checkbox>
            )}
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  },
}));

module.exports = login;