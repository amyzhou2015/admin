/**
 * Created by Riven on 2016/11/28.
 */

import React from 'react';
import {Upload, Icon, message} from 'antd';

const Dragger = Upload.Dragger;


export default class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state={

        }
    }

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload(file) {
        /*const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }*/
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isLt2M;
    }

    handleChange(info) {
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            console.log(info);
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl}));
        }else{
            console.log(info.file.percent);
        }
    }

    render() {
        const props = {
            name: 'file',
            multiple: true,
            showUploadList: false,
            action: 'http://localhost:3000/upload',
            onChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <div style={{ marginTop: 16, height: 180 }}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                </Dragger>
            </div>
        );
    }
}