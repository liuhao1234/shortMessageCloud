import React,{ Component,Fragment } from 'react';
import { Upload, Icon, Modal } from 'antd';

class UploadPicture extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    handleCancel = () => {
        debugger;
        this.setState({ previewVisible: false })
    }

    handlePreview = (file) => {
        debugger;
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleChange = ({ fileList }) => {
        debugger;
        if(fileList.length != 0 && fileList[0].status == 'error'){
            fileList[0].status = 'done';
            console.log(fileList[0].thumbUrl)
        }
        this.setState({ fileList });

        if (this.props.fileList != undefined && this.props.fileList != '') {
            this.props.handleChange();
        }
    }
    render() {
        debugger;
        if (this.props.fileList != undefined && this.props.fileList != '') {
            this.state.fileList = this.props.fileList;
        }

        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className="clearfix">
                <Upload
                    //action="//jsonplaceholder.typicode.com/posts/"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadPicture;