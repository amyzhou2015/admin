/**
 * Created by Riven on 2016/11/20.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Form, Input, Tooltip ,Button,Spin,Alert,notification,Icon} from 'antd';
const FormItem = Form.Item;

const modifyPwd = Form.create()(React.createClass({
  getInitialState() {
    return {
      passwordDirty: false,
      loading: false
    };
  },
  toggle(value) {
    this.setState({loading: value});
  },

  setNotification(type,title,msg){
    notification[type]({
      message: title,
      description: msg,
    })
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let that=this;
        this.toggle(true);

        setTimeout(function(){
          that.toggle(false);
          that.setNotification('success','修改密码','修改密码成功');
        },1500)
        console.log('Received values of form: ', values);
      }
    });
  },
  handlePasswordBlur(e) {
    const value = e.target.value;
    this.setState({passwordDirty: this.state.passwordDirty || !!value});
  },
  checkPassowrd(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不统一,请重新输入!');
    } else {
      callback();
    }
  },
  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.passwordDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6, offset: 3},
      wrapperCol: {span: 6},
    };
    const tailFormItemLayout = {
      wrapperCol: {
        span: 12,
        offset: 9,
      },
    };
    const openNotification = function () {
      notification.open({
        message: 'Notification Title',
        description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        icon: <Icon type="smile-circle" style={{ color: '#2db7f5' }} />,
      });
    };

    return (
      <div>
        <Spin spinning={this.state.loading} tip="Loading...">
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="旧密码"
              hasFeedback
            >
              {getFieldDecorator('oldPassword', {
                rules: [{
                  required: true, message: '请输入您的旧密码!',
                }],
              })(
                <Input type="password"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入您的新密码!',
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" onBlur={this.handlePasswordBlur}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="确认新密码"
              hasFeedback
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '请确认您的新密码!',
                }, {
                  validator: this.checkPassowrd,
                }],
              })(
                <Input type="password"/>
              )}
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" size="large">修改密码</Button>
            </FormItem>
          </Form>
        </Spin>
      </div>
    )
  }
}))

module.exports = modifyPwd;
