import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, DatePicker, Input, message } from 'antd';
import Axios from '../../axios/index';
import SearchForm from './form.js';
import Datatable from './table.js';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
let disabled = false
class Userlist extends Component{
	state = {
		modalShow : false,
		modalTitle : "",
        selectformValue : {},
		formValue : {}
	}
	handleFormSubmit = (e) => {
		e.preventDefault();
		//var formValue = this.formRef.props.form.getFieldsValue();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
			    values['refresh']=Math.random();
				this.setState({ 
				    selectformValue:values
				});
			}
	    });
	}

	setModalVisible = (modalShow,modalTitle)=>{
		this.setState({ modalShow, modalTitle });
		if(!modalShow){
		    disabled = false;
		    this.modalformRef.props.form.resetFields();
		}
	}

	handleAddList = ()=>{
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values)
				if(values.userIdModal==null){
				    Axios.ajax({
	                    url:'/user/save/',
	                    data:{'loginCode':values.loginCodeModal,
	                           'userName':values.userNameModal,
                               'phone':values.phoneModal,
                               'sex':values.sexModal,
                               'orgId':values.orgIdModal.key,
                               'orgName':values.orgIdModal.label,
                               'email':values.emailModal
	                          }
	                }).then((res)=>{
	                    if(res.code === 200){
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
				}else{
				    Axios.ajax({
	                    url:'/user/update/',
	                    data:{'userId':values.userIdModal,
	                        'loginCode':values.loginCodeModal,
                            'userName':values.userNameModal,
                            'phone':values.phoneModal,
                            'orgId':values.orgIdModal.key,
                            'orgName':values.orgIdModal.label,
                            'sex':values.sexModal,
                            'email':values.emailModal}
	                }).then((res)=>{
	                    if(res.code === 200){
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
				
			}
	    });
	}
	
	handleEdit = (record)=>{
		console.log(record)
		console.log(this)
		console.log(this.modalformRef)
		let _this = this;
		Axios.ajax({
            url:'/user/get/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
                disabled = true;
                _this.setModalVisible(true,"编辑用户");
                _this.modalformRef.props.form.setFieldsValue({
                    userIdModal:res.data.data.userId,
                    loginCodeModal:res.data.data.loginCode,
                    orgIdModal:{'key':res.data.data.orgId,'label':res.data.data.orgName},
                    userNameModal:res.data.data.userName,
                    phoneModal:res.data.data.phone,
                    sexModal:res.data.data.sex,
                    emailModal:res.data.data.email
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
							<SearchForm  wrappedComponentRef={(form)=> this.formRef=form} handleSubmit={this.handleFormSubmit} />
						</div>
						<div className="pmain_show">
							<div className="common_area">
								<div className="table_title">
									<span className="title_txt">用户列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加用户")} style={{float:'right'}}><Icon type="plus" />添加用户</Button>
								</div>
								<Datatable formValue={this.state.formValue} selectformValue={this.state.selectformValue}  handleEdit={this.handleEdit}  />
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
      				<ModalFormObj wrappedComponentRef={(form)=> this.modalformRef=form}></ModalFormObj>
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
			<Form hideRequiredMark={true}>
			    <FormItem  {...formItemLayout}>
                    {getFieldDecorator('userIdModal')(
                      <Input type="hidden" />
                    )}
                </FormItem>
			    <FormItem label="登录账号" {...formItemLayout}>
                    {getFieldDecorator('loginCodeModal',{
                        rules : [{
                            required: true,
                            message: '请填写登录账号！'
                        }]
                    })(
                      <Input type="text" disabled={disabled} placeholder="请输入登录账号" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="机构名称" {...formItemLayout}>
                    {getFieldDecorator('orgIdModal',{
                        rules : [{
                            required: true,
                            message: '请选择机构名称'
                        }]
                    })(
                        <Select labelInValue   placeholder="请选择机构名称" style={{ width: 200 }}>
                            <Option value="1">北京资采</Option>
                            <Option value="2">中国联通</Option>
                            <Option value="3">中国移动</Option>
                            <Option value="4">中国电信</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label="用户姓名" {...formItemLayout}>
                    {getFieldDecorator('userNameModal',{
                        rules : [{
                            required: true,
                            message: '请填写用户名称！'
                        }]
                    })(
                      <Input type="text" placeholder="请输入用户姓名" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="手机号码" {...formItemLayout}>
                    {getFieldDecorator('phoneModal',{
                        rules : [{
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                            message: '电话号码格式错误！'
                        },{
                            required: true,
                            message: '请填写手机号码！'
                        }]
                    })(
                      <Input type="text" placeholder="请输入手机号码" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {getFieldDecorator('sexModal',{
                        rules : [{
                            required: true,
                            message: '请选择性别！'
                        }]
                    })(
                          <Select placeholder="请选择性别"  style={{ width: 120 }} >
                              <Option value="男">男</Option>
                              <Option value="女">女</Option>
                          </Select>      
                    )}
                </FormItem>
                <FormItem label="电子邮箱" {...formItemLayout}>
                    {getFieldDecorator('emailModal',{
                        rules : [{
                            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                            message: '电子邮箱格式错误！'
                        },{
                            required: true,
                            message: '请填写电子邮箱！'
                        }]
                    })(
                      <Input type="text" placeholder="请输入电子邮箱" style={{width:200}} />
                    )}
                </FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Userlist;