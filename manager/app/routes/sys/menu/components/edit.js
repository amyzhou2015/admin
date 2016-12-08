/**
 * Created by Riven on 2016/11/30.
 */

import React from 'react';
import cookie from 'react-cookie';
import ajax from 'axios';
import seetings from '../../../../seetings';
import {Table, Icon, Button, Popconfirm, Spin, Input, message, Modal} from 'antd';
const ajaxHost = seetings.seetings.ajaxHost;
let _menu = [],
    menuData = [];

class EditableCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            editable: false,

        }
    }

    componentWillUpdate(nextprops) {
        if (nextprops.spining && nextprops.value !== this.state.value) {
            this.setState({
                value: nextprops.value,
            })
        }
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({value: value});
    }

    check(e) {
        this.setState({editable: false});
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    }

    edit() {
        this.setState({editable: true});
    }

    render() {
        const {value, editable} = this.state;
        return (<div className="editable-cell">
            {
                editable ?
                    <div className="editable-cell-input-wrapper">
                        <Input
                            value={value}
                            onChange={this.handleChange.bind(this)}
                            onPressEnter={this.check.bind(this)}
                            style={{width: "80%"}}
                        />
                        <Icon
                            type="check"
                            className="editable-cell-icon-check"
                            onClick={this.check.bind(this)}
                        />
                    </div>
                    :
                    <div className="editable-cell-text-wrapper">
                        {value || ' '}
                        <Icon
                            type="edit"
                            className="editable-cell-icon"
                            onClick={this.edit.bind(this)}
                        />
                    </div>
            }
        </div>);
    }
}

export default class editMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: cookie.load('userName'),
            menuData: [],
            spining: true,
            addHref: '',
            addName: '',
            addId:'',
            addVisible: false
        }
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData() {
        const that = this;
        ajax({
            method: "get",
            url: ajaxHost + "menu/edit",
            timeout: 5000
        })
            .then(function (response) {
                if (response.status == 200) {
                    _menu = [], menuData = [];
                    var data = response.data;
                    if (data && data.success) {
                        menuData = data.data;
                        let _index = 0;
                        menuData.map((i, t) => {
                            if (i.parent_id == 1) {
                                _menu[_index] = i;
                                _menu[_index].trees = 1;
                                _menu[_index].key = 'cms' + i.id;
                                delete menuData[t];
                                _index++;
                            }
                        });

                        for (let i = 0; i < _index; i++) {
                            that._loadMenu(_menu[i].id, i);
                        }

                        that.setState({
                            menuData: _menu,
                        })
                        sessionStorage.menu = '';

                        setTimeout(function () {
                            that.setState({
                                spining: false
                            })
                        }, 0)

                    }
                } else {
                    console.error(error);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    _loadMenu(pid, tIndex) {
        let subMenu = [],
            index = 0;
        menuData.map((i, t) => {
            if (i.parent_id == pid) {
                subMenu[index] = i;
                subMenu[index].key = 'cms' + i.id;
                index++;
                delete menuData[t]
            }
        });

        _menu[tIndex].children = subMenu;

        let _length = Object.keys(subMenu).length;
        for (let i = 0; i < _length; i++) {
            this._loadMenu2(subMenu[i].id, tIndex, i);
        }
    }

    _loadMenu2(pid, tIndex, zIndex) {
        let subMenu = [],
            index = 0;
        menuData.map((i, t) => {
            if (i.parent_id == pid) {
                subMenu[index] = i;
                subMenu[index].key = 'cms' + i.id;
                index++;
                delete menuData[t]
            }
        });

        _menu[tIndex].children[zIndex].children = subMenu;
    }

    deleteColumn(id) {
        const that = this;
        ajax({
            method: "post",
            url: ajaxHost + "menu/update/delete",
            data: {id: id}
        })
            .then(function (response) {
                const data = response.data;
                if (data && data.success) {
                    message.success(data.msg);
                    that.refreshData();
                } else {
                    that.refreshData();
                    data.msg = data.msg ? data.msg : "服务异常"
                    message.error(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    showColumn(id) {
        const that = this;
        ajax({
            method: "post",
            url: ajaxHost + "menu/update/show",
            data: {id: id}
        })
            .then(function (response) {
                const data = response.data;
                if (data && data.success) {
                    message.success(data.msg);
                    that.refreshData();
                } else {
                    that.refreshData();
                    data.msg = data.msg ? data.msg : "服务异常"
                    message.error(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    hideColumn(id) {
        const that = this;
        ajax({
            method: "post",
            url: ajaxHost + "menu/update/hide",
            data: {id: id}
        })
            .then(function (response) {
                const data = response.data;
                if (data && data.success) {
                    message.success(data.msg);
                    that.refreshData();
                } else {
                    that.refreshData();
                    data.msg = data.msg ? data.msg : "服务异常"
                    message.error(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    refreshData() {
        this.setState({
            spining: true
        })
        this._fetchData();
    }

    onCellChange(type, record) {
        return (value) => {
            if (type == 'name') {
                if (record.name !== value) {
                    this.changeMenu(type, value, record)
                    record.name = value;
                }
            } else if (type == 'href') {
                if (record.href !== value) {
                    this.changeMenu(type, value, record)
                    record.href = value;
                }
            } else {
                message.error('未知错误!');
            }

        };
    }

    changeMenu(type, value, record) {
        const that = this;
        if (type == 'name') {
            this.setState({
                spining: true
            })
            ajax({
                method: "post",
                url: ajaxHost + "menu/update/name",
                data: {name: value, id: record.id}
            })
                .then(function (response) {
                    const data = response.data;
                    if (data && data.success) {
                        message.success('修改成功');
                        that.refreshData();
                    } else {
                        that.refreshData();
                        message.error(data.msg)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else if (type == 'href') {
            this.setState({
                spining: true
            })
            ajax({
                method: "post",
                url: ajaxHost + "menu/update/href",
                data: {href: value, id: record.id}
            })
                .then(function (response) {
                    const data = response.data;
                    if (data && data.success) {
                        message.success('修改成功');
                        that.refreshData();
                    } else {
                        that.refreshData();
                        data.msg = data.msg ? data.msg : "服务异常"
                        message.error(data.msg)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else {
            message.error('服务异常!');
        }
    }

    addMenu() {
        const that = this;
        let data={};
        if(this.state.addId && this.state.addId!=''){
            console.log(this.state.addId)
            data={parentId:this.state.addId,name:this.state.addName,href:this.state.addHref}
        }else{
            console.log(1234)
            data={name:this.state.addName,href:this.state.addHref}
        }

        if (this.state.addName) {
            ajax({
                method: "post",
                url: ajaxHost + "menu/update/add",
                data: data
            })
                .then(function (response) {
                    const data = response.data;
                    if (data && data.success) {
                        message.success('新增成功');
                        that.refreshData();
                        that.setState({
                            addVisible: false,
                            addName: '',
                            addHref: ''
                        })
                    } else {
                        that.refreshData();
                        data.msg = data.msg ? data.msg : "服务异常"
                        message.error(data.msg)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else {
            message.error('未知错误！');
        }

    }

    hideAddModal() {
        this.setState({
            addId:"",
            addVisible: false
        })
    }

    showAddModal(id) {
        const that=this;
        if(id && typeof id!='object'){
            this.setState({
                addId:id
            })
        }else{
            this.setState({
                addId:''
            })
        }
        this.setState({
            addVisible: true
        })
    }


    addChange(type, e) {
        if (type == 'name') {
            this.setState({
                addName: e.target.value
            })
        } else if (type == 'href') {
            this.setState({
                addHref: e.target.value
            })
        } else {
            return false;
        }

    }

    render() {
        const columns = [{
            title: '展开',
            dataIndex: 'z',
            key: 'z',
            width: '5%',
        }, {
            title: '栏目名称',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    spining={this.state.spining}
                    onChange={this.onCellChange('name', record)}
                />
            ),
        }, {
            title: '栏目链接',
            dataIndex: 'href',
            key: 'href',
            width: '40%',
            render: (text, record) => {
                const result = record.trees || (record.children && record.children.length > 0) ?
                    ""
                    :
                    <EditableCell
                        value={text}
                        spining={this.state.spining}
                        onChange={this.onCellChange('href', record)}
                    />

                return result;

            },
        }, {
            title: "操作",
            key: "edit",
            width: '20%',
            render: (record) => {
                return (
                    <div>
                        <Popconfirm title="确定删除本栏目以及本栏目的所有子栏目吗？" onConfirm={this.deleteColumn.bind(this, record.id)}
                                    okText="删除" cancelText="取消">
                            <Button>删除</Button>
                        </Popconfirm>
                        &nbsp;&nbsp;
                        {record.is_show == 1 ?
                            <Popconfirm title="确定隐藏本栏目以及本栏目的所有子栏目吗？" onConfirm={this.hideColumn.bind(this, record.id)}
                                        okText="隐藏" cancelText="取消">
                                <Button>隐藏</Button>
                            </Popconfirm> :
                            <Popconfirm title="确定显示本栏目以及本栏目的所有子栏目吗？" onConfirm={this.showColumn.bind(this, record.id)}
                                        okText="显示" cancelText="取消">
                                <Button>显示</Button>
                            </Popconfirm>
                        }

                        &nbsp;&nbsp;
                        {record.children ?
                            <Button onClick={this.showAddModal.bind(this,record.id)}>新增</Button>
                            :
                            ""
                        }
                    </div>
                )
            }
        }];

        const title = (() => {
            return (
                <div>
                    <Button onClick={this.refreshData.bind(this)} type='ghost' className="mr10"><Icon
                        type="reload"></Icon></Button>
                    <span className="text-mid">菜单管理</span>
                    <div className="fr">
                        <Button type='ghost' className="mr10" onClick={this.showAddModal.bind(this)}><Icon
                            type="plus"></Icon></Button>
                    </div>
                </div>
            )
        })

        return (
            <div>
                <div>
                    <Spin tip="加载中..." spinning={this.state.spining}>
                        <Table title={title} columns={columns} dataSource={this.state.menuData} pagination={false}/>
                    </Spin>

                    <Modal title="新增栏目" visible={this.state.addVisible}
                           onCancel={this.hideAddModal.bind(this)}
                           onOk={this.addMenu.bind(this)}
                    >
                        <div>
                            <span>标题:<Input value={this.state.addName} style={{width: "70%", "marginLeft": "10px"}}
                                            onChange={this.addChange.bind(this, 'name')}></Input></span>
                            <br/>
                            <br/>

                            <span>链接:<Input value={this.state.addHref} style={{width: "70%", "marginLeft": "10px"}}
                                            onChange={this.addChange.bind(this, 'href')}></Input></span>
                            <br/>
                            <br/>

                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}
