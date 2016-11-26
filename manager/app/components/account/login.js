/**
 * Created by Riven on 2016/11/21.
 */
import React from 'react';
import cookie from 'react-cookie';
import {Form, Icon, Input, Button, Checkbox, message, Spin} from 'antd';
import ajax from 'axios';
import Seetings from '../../seetings';
const ajaxHost = Seetings.seetings.ajaxHost;
const FormItem = Form.Item;

const login = Form.create()(React.createClass({
    getInitialState(){
        return {logining: false};
    },
    handleSubmit(e) {
        var that=this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var now = new Date();
                var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 8, now.getUTCMinutes() + 15, now.getUTCSeconds());
                //cookie.save('userName', values.userName, {path: "/", expires: now_utc});
                //window.location.reload();

                this.setState({
                    logining:true
                })

                ajax({
                    method:"post",
                    url:ajaxHost + "login",
                    data:{
                        userName: values.userName,
                        password: values.password
                    },
                    timeout:5000,
                })
                    .then(function (response) {
                        console.log(response)
                        var data=response.data;
                        if (data && data.success) {
                            message.success("登陆成功");
                            cookie.save('userName',data.data.name, {path: "/", expires: now_utc});
                            cookie.save('token',data.data.token, {path: "/", expires: now_utc});
                            cookie.save('loginName',data.data.login_name, {path: "/", expires: now_utc});
                            console.log(cookie.load('userName'))
                            console.log(cookie.load('token'))
                            console.log(cookie.load('loginName'))
                            window.location.reload();
                        } else if (data && data.msg) {
                            message.warning(data.msg);
                        } else {
                            message.error("服务异常");
                        }

                        that.setState({
                            logining:false
                        })
                    })
                    .catch(function (error) {
                        const errors = error.toString();
                        let errorMsg = errors.indexOf('timeout')==-1? "服务异常":"请求超时";
                        message.error(errorMsg);
                        that.setState({
                            logining:false
                        })
                    })

                //console.log('Received values of form: ', values);
            }
        });
    },
    render() {
        const {getFieldDecorator} = this.props.form;
        const mt = (document.documentElement.clientHeight - 250) / 3;
        return (
            <div className="login-box">
                <Spin tip="登录中..." spinning={this.state.logining}>

                    <Form onSubmit={this.handleSubmit} style={{marginTop: mt}} className="login-form">
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: '请输入您的用户名!'}],
                            })(
                                <Input addonBefore={<Icon type="user"/>} placeholder="userName"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入您的密码!'}],
                            })(
                                <Input addonBefore={<Icon type="lock"/>} type="password" placeholder="Password"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox style={{color: "#ffffff"}}>记住密码</Checkbox>
                            )}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        );
    },
}));

module.exports = login;