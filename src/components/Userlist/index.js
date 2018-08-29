import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, DatePicker, Input, message } from 'antd';
import Axios from '../../axios/index';
import SearchForm from './form.js';
import Datatable from './table.js';
import TreeSet from './tree.js';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
class Userlist extends Component{
    constructor(props){
        super(props);
        this.initTreeNode();
        this.getOrgSelect();
    }
	state = {
	    options : "",
	    disabled :false,
		modalShow : false,
		modalTitle : "",
        selectformValue : {},
		formValue : {},
        roleModalShow : false,
        selectUserId:0,
        selectRoleIds:[],
        initTreeNodeData : {},
		loadinge:false
	}
	//获取组织结构下拉信息
	getOrgSelect(){
        let _this = this
        Axios.ajax({
            url:'/org/queryOrgSelect',
            data:{}
        }).then((res)=>{
            let opts = res.data.data.map(
                    (element)=>{
                        return <Option value={element.orgId}>{element.orgName}</Option>});
            _this.setState({options:opts})
        })
    }
	//第一次加载树形菜单数据
    initTreeNode(){
        Axios.ajax({
            url:'/role/query',
            data:{"startIndex":1,"pageSize":9999
            }
        }).then((res)=>{
            this.setState({initTreeNodeData: res.data.data})
        })
    }
	//查询头 查询按钮
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
	//设置用户信息层的显示或隐藏
	setModalVisible = (modalShow,modalTitle,disabled)=>{
		this.setState({ modalShow, modalTitle,disabled });
		if(!modalShow){
		    this.modalformRef.props.form.resetFields();
		}
	}

	//设置菜单信息层的显示或隐藏
    setRoleModalVisible = (roleModalShow)=>{
        this.setState({ roleModalShow});
    }
    //新增 或 修改  用户      确定按钮事件
    handleAddOrUpdateRole = ()=>{
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
			    this.setState({loadinge:true}) 
			    let _this = this;
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
	                    _this.setState({loadinge:false}) 
	                    if(res.code === 200){
	                        message.success(res.message);
	                        values['refresh']=Math.random();
	                        _this.setState({ 
	                            modalShow:false,formValue:values,disabled:false
	                        })
	                        _this.modalformRef.props.form.resetFields();
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
	                    _this.setState({loadinge:false}) 
	                    if(res.code === 200){
	                        message.success(res.message);
	                        values['refresh']=Math.random();
	                        _this.setState({ 
	                            modalShow:false,formValue:values,disabled:false
	                        })
	                        _this.modalformRef.props.form.resetFields();
	                    }else{
	                        message.error(res.message);
	                    }
	                })
				}
				
			}
	    });
	}
    
    //从tree组件获取所选值
    getSelectUserRole(values){
        this.setState({selectRoleIds:values});
    }
    
    //设置角色菜单关系     确定按钮事件
    handleSetUserRole = (values)=>{
        let _this = this;
        _this.setState({loading: true,roleModalShow:false,loadinge:true});
        Axios.ajax({
            url:'/user/setUserRole/',
            data:{'userId':_this.state.selectUserId,'roleIds':_this.state.selectRoleIds}
        }).then((res)=>{
            _this.setState({loadinge:false}) 
            if(res.code === 200){
                message.success(res.message);     
                _this.setState({loading: false,roleModalShow:false});
            }else{
                message.error(res.message);
            }
        })
    }
	
    //初始化修改页面参数
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
                _this.setModalVisible(true,"编辑用户",true);
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

	//获取用户已经设置的角色
    handleSetRole = (record)=>{
        const _this = this;
        this.setState({loading: true})
        Axios.ajax({
                url:'/user/queryUserRole/'+record.key,
                data:{}
            }).then((res)=>{
                _this.setState({
                    selectUserId:record.key,
                    roleModalShow:true,
                    loading: false,
                    selectRoleIds:res.data.data.map((item)=>{
                        return item.roleId+""
                    })
                })
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
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加用户",false)} style={{float:'right'}}><Icon type="plus" />添加用户</Button>
								</div>
								<Datatable formValue={this.state.formValue} selectformValue={this.state.selectformValue}  handleEdit={this.handleEdit} handleSetRole={this.handleSetRole} />
							</div>
						</div>
					</div>
				</div>
				<Modal
		          title={this.state.modalTitle}
		          visible={this.state.modalShow}
		          closable={false}
				  confirmLoading={this.state.loadinge} 
		          onCancel={this.setModalVisible.bind(this,false,"",false)}
		          onOk={this.handleAddOrUpdateRole}
		        >
      				<ModalFormObj disabled={this.state.disabled} options={this.state.options} wrappedComponentRef={(form)=> this.modalformRef=form}></ModalFormObj>
		        </Modal>
		        <Modal
                    title={'设置角色'}
                    visible={this.state.roleModalShow}
                    closable={false}
		            confirmLoading={this.state.loadinge} 
                    onCancel={this.setRoleModalVisible.bind(this,false)}
                    onOk={this.handleSetUserRole}
                  >   
                <TreeSet selectRoleIds={this.state.selectRoleIds}  getSelectUserRole = {this.getSelectUserRole.bind(this)}  initTreeNodeData={this.state.initTreeNodeData} ></TreeSet>
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
                      <Input type="text" disabled={this.props.disabled} placeholder="请输入登录账号" style={{width:200}} />
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
                            {this.props.options}
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