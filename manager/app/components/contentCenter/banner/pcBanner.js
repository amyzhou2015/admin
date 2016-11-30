/**
 * Created by Riven on 2016/11/28.
 */

import React from 'react';
import {Table, Button, Modal, Icon, Input, Upload, message, Spin, Popconfirm} from 'antd';
import ajax from 'axios';
import Seetings from '../../../seetings';
const ajaxHost = Seetings.seetings.ajaxHost;

class EditableCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            editable: false,

        }
    }

    componentWillUpdate(nextprops) {
        if (nextprops.spinning && nextprops.value !== this.state.value) {
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


export default class pcBanner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            addVisible: false,
            spinning: true,
            dataSource: [],
            imgsrc: "",
            id: 0,
            addImage: "",
            addTitle: ""
        }
    }

    componentDidMount() {
        this._fetchData();
    }

    _fetchData() {
        const that = this;
        ajax({
            method: "get",
            url: ajaxHost + 'banner',
            timeout: 5000
        })
            .then(function (response) {
                var data = response.data;
                if (data && data.success) {
                    that.setState({
                        dataSource: data.data,
                    })

                    setTimeout(function () {
                        that.setState({
                            spinning: false
                        })
                    }, 100)
                } else {
                    console.log('fail');
                }
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    controlModal(src, id) {
        const that = this;
        this.setState({
            visible: !this.state.visible,
            id: id
        })

        if (!src || src == '' || typeof src != "string") {
            setTimeout(function () {
                that.setState({
                    imgsrc: '',
                })
            }, 0)
        } else {
            this.setState({
                imgsrc: src,
            })
        }

    }

    onCellChange(record) {
        return (value) => {
            if (record.title !== value) {
                this.changeBanner('title', value, record)
                record.name = value;
            }
        };
    }

    imgChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            //console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            const data = info.file.response;
            if (data && data.success) {
                message.success(`${info.file.name} 上传成功.`);
                this.setState({
                    imgsrc: data.url
                })
            } else {
                message.error(data.msg)
                this.setState({
                    imgsrc: false
                })
            }

        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            this.setState({
                imgsrc: false
            })
        }
    }

    addImg(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            //console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            const data = info.file.response;
            if (data && data.success) {
                message.success(`${info.file.name} 上传成功.`);
                this.setState({
                    addImage: data.url
                })
            } else {
                message.error(data.msg)
                this.setState({
                    addImage: false
                })
            }

        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            this.setState({
                imgsrc: false
            })
        }
    }

    changeBanner(type, value, record) {
        const that = this;
        if (type == 'title') {
            ajax({
                method: "post",
                url: ajaxHost + "banner/update/title",
                data: {title: value, id: record.id}
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
        } else if (type == 'image') {
            if (value && typeof value == "string" && value != '') {
                ajax({
                    method: "post",
                    url: ajaxHost + "banner/update/image",
                    data: {picurl: value, id: this.state.id}
                })
                    .then(function (response) {
                        const data = response.data;
                        if (data && data.success) {
                            message.success('修改成功');
                            that.setState({
                                visible: false,
                                imgsrc: ""
                            })
                            that.refreshData();
                        } else {
                            that.refreshData();
                            message.error(data.msg)
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            } else {
                message.error('文件上传失败，请重新上传文件！');
            }
        } else {
            return false;
        }
    }

    disabledBanner(id) {
        const that = this;
        ajax({
            method: "post",
            url: ajaxHost + "banner/update/disable",
            data: {id: id}
        })
            .then(function (response) {
                const data = response.data;
                if (data && data.success) {
                    message.success('禁用成功');
                    that.refreshData();
                } else {
                    that.refreshData();
                    message.error(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    enabledBanner(id) {
        const that = this;
        if(!id){
            message.error('未知错误！');
        }
        ajax({
            method: "post",
            url: ajaxHost + "banner/update/enable",
            data: {id: id}
        })
            .then(function (response) {
                const data = response.data;
                if (data && data.success) {
                    message.success('启用成功');
                    that.refreshData();
                } else {
                    that.refreshData();
                    message.error(data.msg)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    deleteBanner(id) {
        console.log(id)
        const that = this;
        if (id) {
            ajax({
                method: "post",
                url: ajaxHost + "banner/update/delete",
                data: {id: id}
            })
                .then(function (response) {
                    const data = response.data;
                    if (data && data.success) {
                        message.success('删除成功');
                        that.refreshData();
                    } else {
                        that.refreshData();
                        message.error(data.msg)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else {
            message.error('未知错误，请刷新重试！');
        }
    }

    refreshData() {
        this.setState({
            spinning: true
        })
        this._fetchData();
    }

    controlAddModal() {
        this.setState({
            addVisible: false
        })
    }

    addModalOk() {
        const that = this;
        const title = this.state.addTitle;
        const image = this.state.addImage;
        if (title && image) {
            ajax({
                method: "post",
                url: ajaxHost + "banner/update/add",
                data: {picurl: image, title: title}
            })
                .then(function (response) {
                    const data = response.data;
                    if (data && data.success) {
                        message.success('新增成功');
                        that.setState({
                            addVisible: false,
                            addImage: "",
                            addTitle: "",
                        })
                        that.refreshData();
                    } else {
                        that.refreshData();
                        message.error(data.msg)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } else {
            if (!title) {
                message.error("标题未设置！")
            } else if (!image) {
                message.error("图片未上传成功！")
            } else {
                message.error("标题或者图片未上传成功！")
            }
        }
    }

    addBannerModal() {
        this.setState({
            addVisible: true
        })
    }

    addTitleChage(e) {
        this.setState({
            addTitle: e.target.value
        })
    }

    render() {
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: "title",
            width: '40%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    spinning={this.state.spinning}
                    onChange={this.onCellChange(record)}
                />
            ),
        }, {
            title: '缩略图',
            key: "thumb",
            width: '40%',
            render: (text, record) => (
                <img style={{"cursor": "pointer"}}
                     onClick={this.controlModal.bind(this, text.picurl, text.id)}
                     width={120} src={text.picurl}></img>
            )
        }, {
            title: '操作',
            key: "edit",
            width: '20%',
            render: (text, record) => (
                <span>
                    {
                        text.disabled ?
                            <Popconfirm title="确定启用吗？" onConfirm={this.enabledBanner.bind(this, text.id)}
                                        okText="启用" cancelText="取消">
                                <Button type="">启用</Button>
                            </Popconfirm>

                            :
                            <Popconfirm title="确定禁用吗？" onConfirm={this.disabledBanner.bind(this, text.id)}
                                        okText="禁用" cancelText="取消">
                                <Button type="">禁用</Button>
                            </Popconfirm>
                    }
                    &nbsp;&nbsp;&nbsp;
                    <Popconfirm title="确定删除吗？" onConfirm={this.deleteBanner.bind(this, text.id)}
                                okText="删除" cancelText="取消">
                    <Button type="">删除</Button>
                    </Popconfirm>
                </span>
            ),
        }];


        const title = (() => {
            return (
                <div>
                    <Button onClick={this.refreshData.bind(this)} type='ghost' className="mr10"><Icon
                        type="reload"></Icon></Button>
                    <span className="text-mid">Banner管理</span>
                    <div className="fr">
                        <Button type='ghost' className="mr10" onClick={this.addBannerModal.bind(this)}><Icon
                            type="plus"></Icon></Button>
                    </div>
                </div>
            )
        })

        const uploadProps = {
            name: 'file',
            multiple: true,
            showUploadList: false,
            action: ajaxHost+'upload',
            onChange: this.imgChange.bind(this),
        };

        const addUploadProps = {
            name: 'file',
            multiple: true,
            showUploadList: false,
            action: ajaxHost+'upload',
            onChange: this.addImg.bind(this),
        };

        return (
            <Spin tip="加载中..." spinning={this.state.spinning}>
                <div>
                    <Table
                        columns={columns}
                        dataSource={this.state.dataSource}
                        loading={this.state.spinning}
                        bordered
                        pagination={false}
                        title={title}
                    />

                    <Modal title="图片预览" visible={this.state.visible}
                           onCancel={this.controlModal.bind(this)}
                           footer={[<Upload {...uploadProps} key="2" className="fl"><Button type=""
                                                                                            key="1">重新上传</Button></Upload>,
                               <Button key="3" onClick={this.controlModal.bind(this)}>取消</Button>,
                               <Button onClick={this.changeBanner.bind(this, 'image', this.state.imgsrc)} type="primary"
                                       key="4">确定</Button>]}>
                        <img style={{width: "100%"}} src={this.state.imgsrc} alt=""/>
                    </Modal>

                    <Modal title="新增Banner" visible={this.state.addVisible}
                           onCancel={this.controlAddModal.bind(this)}
                           onOk={this.addModalOk.bind(this)}
                    >
                        <div>
                            <span>标题:<Input value={this.state.addTitle} style={{width: "60%", "marginLeft": "10px"}}
                                            onChange={this.addTitleChage.bind(this)}></Input></span>
                            <br/>
                            <br/>

                            <span>缩略图:</span>
                            <br/>
                            <div className="mt10">
                                {
                                    this.state.addImage && this.state.addImage != '' ?
                                        <div>
                                            <Upload {...addUploadProps}><Button>重新上传</Button></Upload>
                                            <img className="mt10" style={{width: "100%"}} src={this.state.addImage}
                                                 alt=""/>
                                        </div>
                                        :
                                        <Upload {...addUploadProps}><Button>点击上传</Button></Upload>
                                }
                            </div>
                            <br/>
                            <br/>

                        </div>
                    </Modal>
                </div>
            </Spin>
        );
    }
}
