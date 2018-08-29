import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Input, message } from 'antd';
import SearchForm from './form.js';
import Datatable from './table.js';
import UploadPicture from './upload.js';
import {Radio} from "antd/lib/index";
import Axios from "../../axios";
import './index.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class Organization extends Component{
	state = {
		modalShow : false,
		modalTitle : "",
		formValue : {},
        fileList: [],
	}

	// 查询
	handleFormSubmit = (e) => {
		e.preventDefault();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
                values['refresh']=Math.random();
				this.setState({ 
					formValue:values
				});
			}
	    });
	}

	setModalVisible = (modalShow,modalTitle)=>{
		this.setState({ modalShow, modalTitle });
        if(!modalShow){
            this.modalformRef.props.form.resetFields();
        }
	}

	handleAddList = ()=>{
        const base64 = ""+document.getElementsByClassName("ant-upload-list-item-thumbnail")[0];
        this.modalformRef.props.form.setFieldsValue({orgBusinessAd:base64});
		this.modalformRef.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
                Axios.ajax({
                    url:'/org/saveSmsOrg/',
                    data:{'orgId':values.orgId,'orgName':values.orgName,'orgAddress':values.orgAddress,'orgBusinessAd':values.orgBusinessAd,'orgContactName':values.orgContactName,'orgContactMail':values.orgContactMail,'orgContactPhone':values.orgContactPhone,"extnum":values.extnum,"maxCnt":values.maxCnt}
                }).then((res)=>{
                    if(res.code === 200){
                        if(values.orgId === undefined){
                            this.formRef.props.form.setFieldsValue({'orgName':'','state':'-1'});
                            values = {'orgName':'','state':'-1'};
                        }
                        message.success(res.message);
                        values['refresh']=Math.random();
                        this.setState({
                            modalShow:false,formValue:values
                        })
                        this.modalformRef.props.form.resetFields();
                    }else{
                        message.error(res.message);
                    }
                })
            }
	    });
	}

    handleChange = () =>{
		debugger;
        this.setState({
            fileList: []
        });
    }

	handleEdit = (record)=>{
		console.log(record)
		console.log(this)
		console.log(this.modalformRef)

		this.setState({
            fileList: [{
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: record.orgBusinessAd,
            }]
		});

        let _this = this;
        Axios.ajax({
            url:'/org/queryById/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
            	debugger;
                _this.setModalVisible(true,"编辑机构");

                _this.modalformRef.props.form.setFieldsValue({
                    orgId:res.data.data.orgId,
                    orgName:res.data.data.orgName,
                    orgAddress:res.data.data.orgAddress,
                    orgBusinessAd:res.data.data.orgBusinessAd,
                    orgContactName:res.data.data.orgContactName,
                    orgContactMail:res.data.data.orgContactMail,
                    orgContactPhone:res.data.data.orgContactPhone,
                    extnum:res.data.data.extnum,
                    maxCnt:res.data.data.maxCnt
                });
            }else{
                message.error(res.message);
            }
        })
	}

	render() {
		return (
			<Fragment>
				<div className="pmain_con">
					<div className="pmainconinner">
						<div className="search">
							<SearchForm wrappedComponentRef={(form)=> this.formRef=form} handleSubmit={this.handleFormSubmit} />
						</div>
						<div className="pmain_show">
							<div className="common_area">
								<div className="table_title">
									<span className="title_txt">机构列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加机构")} style={{float:'right'}}><Icon type="plus" />添加机构</Button>
								</div>
								<Datatable formValue={this.state.formValue} handleEdit={this.handleEdit} />
							</div>
						</div>
					</div>
				</div>
				<Modal
		          title={this.state.modalTitle}
		          visible={this.state.modalShow}
		          closable={false}
		          onCancel={this.setModalVisible.bind(this,false,"")}
		          onOk={this.handleAddList}
		        >
      				<ModalFormObj wrappedComponentRef={(form)=> this.modalformRef=form} fileList={this.state.fileList} handleChange={this.handleChange}></ModalFormObj>
		        </Modal>
			</Fragment>
		)
	}
}


class ModalForm extends Component{
	render(){
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 18
			},
	    };
		return(
			<Form hideRequiredMark={true} onSubmit={this.props.handleSubmit}>
				<FormItem  {...formItemLayout}>
					{getFieldDecorator('orgId')(
						<Input type="hidden" />
					)}
				</FormItem>
				<FormItem label="机构名称" {...formItemLayout}>
		            {getFieldDecorator('orgName',{
		            	rules : [{
		            		required: true,
		            		message: '请填写机构名称！'
		            	}]
		            })(
		              <Input type="text" placeholder="请输入机构名称" style={{width:280}} />
		            )}
		        </FormItem>
			    <FormItem label="机构地址" {...formItemLayout}>
						{getFieldDecorator('orgAddress',{
							rules : [{
								required: true,
								message: '请填写机构地址！'
							}]
						})(
						  <Input type="text" placeholder="请输入机构地址" style={{width:280}} />
						)}
		        </FormItem>
        		<FormItem label="营业执照" {...formItemLayout}>
		                <UploadPicture fileList={this.props.fileList} handleChange={this.props.handleChange}/>
						{getFieldDecorator('orgBusinessAd',{
							rules : [{
								required: true,
								message: '请上传营业执照！'
							}]
						})(
                            <Input type="hidden" id="orgBusinessAd"/>
						)}
    			</FormItem>
		        <FormItem label="对接人姓名" {...formItemLayout}>
						{getFieldDecorator('orgContactName',{
							rules : [{
								required: true,
								message: '请填写对接人姓名！'
							}]
						})(
						<Input type="text" placeholder="请输入对接人姓名" style={{width:280}} />
						)}
	            </FormItem>
                <FormItem label="对接人邮箱" {...formItemLayout}>
						{getFieldDecorator('orgContactMail',{
							rules : [{
								pattern:/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/,
                                message: '邮箱格式错误！'
                            },{
								required: true,
								message: '请填写对接人邮箱！'
							}]
						})(
						<Input type="text" placeholder="请输入对接人邮箱" style={{width:280}} />
						)}
                </FormItem>
                <FormItem label="对接人电话" {...formItemLayout}>
						{getFieldDecorator('orgContactPhone',{
							rules : [{
                                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                                message: '电话号码格式错误！'
                            },{
								required: true,
								message: '请填写对接人电话！'
							}]
						})(
						<Input type="text" placeholder="请输入对接人电话" style={{width:280}} />
						)}
                </FormItem>
        		<FormItem label="扩展码" {...formItemLayout}>
					{getFieldDecorator('extnum',{
						rules : [{
							required: true,
							message: '请填写扩展码！'
						}]
					})(
						<Input type="text" placeholder="请输入扩展码" style={{width:280}} />
					)}
    			</FormItem>
        		<FormItem label="单次请求最大数量" {...formItemLayout}>
					{getFieldDecorator('maxCnt',{
						rules : [{
							required: true,
							message: '请填写单次请求最大数量！'
						}]
					})(
						<Input type="text" placeholder="请输入单次请求最大数量" style={{width:280}} />
					)}
    			</FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Organization;