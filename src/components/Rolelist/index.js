import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, DatePicker, Input,Tree, message } from 'antd';
import Axios from '../../axios/index';
import SearchForm from './form.js';
import Datatable from './table.js';
import TreeSet from './tree.js';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
let disabled = false;
class Rolelist extends Component{
    constructor(props){
        super(props);
        this.initTreeNode();
    }
	state = {
	    menuModalShow : false,
		modalShow : false,
		modalTitle : "",
		loading : false,
		selectformValue : {},
        formValue : {},
        selectedMenuIds:[],
        selectRoleId:0,
        selectMenuIds:[],
        initTreeNodeData : {}
	}
	//第一次加载树形菜单数据
	initTreeNode(){
        Axios.ajax({
            url:'/menu/query',
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
	setModalVisible = (modalShow,modalTitle)=>{
		this.setState({ modalShow, modalTitle });
		if(!modalShow){
		    disabled = false;
		    this.modalformRef.props.form.resetFields();
		}
	}
	
	//设置菜单信息层的显示或隐藏
    setMenuModalVisible = (menuModalShow)=>{
        this.setState({ menuModalShow});
    }
	
	//新增 或 修改 角色      确定按钮事件
	handleAddOrUpdateRole = ()=>{
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values)
				if(values.roleIdModal==null){
				    Axios.ajax({
	                    url:'/role/save/',
	                    data:{'roleName':values.roleNameModal,'roleCode':values.roleCodeModal}
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
	                    url:'/role/update/',
	                    data:{'roleId':values.roleIdModal,'roleName':values.roleNameModal,'roleCode':values.roleCodeModal}
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
	
	//从tree组件获取所选值
	getSelectRoleMenu(values){
	    this.setState({selectMenuIds:values,selectedMenuIds:values});
	}
	
	//设置角色菜单关系     确定按钮事件
    handleSetRoleMenu = (values)=>{
        let _this = this;
        _this.setState({loading: true,menuModalShow:false});
        Axios.ajax({
            url:'/user/setRoleMenu/',
            data:{'roleId':_this.state.selectRoleId,'menuIds':_this.state.selectMenuIds}
        }).then((res)=>{
            if(res.code === 200){
                message.success(res.message);     
                _this.setState({loading: false,menuModalShow:false});
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
            url:'/role/get/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
                disabled = true;
                _this.setModalVisible(true,"编辑角色");
                _this.modalformRef.props.form.setFieldsValue({
                    roleIdModal:res.data.data.roleId,
                    roleNameModal:res.data.data.roleName,
                    roleCodeModal:res.data.data.roleCode
                });
                
            }else{
                message.error(res.message);
            }
        })
	}
	//获取用户自己已经设置的菜单
	handleSetMenu = (record)=>{
        const _this = this;
        this.setState({loading: true})
        Axios.ajax({
                url:'/user/queryRoleMenu/'+record.key,
                data:{}
            }).then((res)=>{
                _this.setState({
                    selectRoleId:record.key,
                    menuModalShow:true,
                    loading: false,
                    selectedMenuIds:res.data.data.map((item)=>{
                        return item.menuId+""
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
									<span className="title_txt">角色列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加角色")} style={{float:'right'}}><Icon type="plus" />添加角色</Button>
								</div>
								<Datatable formValue={this.state.formValue} selectformValue={this.state.selectformValue}  handleEdit={this.handleEdit} handleSetMenu={this.handleSetMenu}  />
							</div>
						</div>
					</div>
				</div>
				<Modal
		          title={this.state.modalTitle}
		          visible={this.state.modalShow}
		          closable={false}
		          onCancel={this.setModalVisible.bind(this,false,"")}
		          onOk={this.handleAddOrUpdateRole}
		        >
      				<ModalFormObj wrappedComponentRef={(form)=> this.modalformRef=form}></ModalFormObj>
		        </Modal>
      			<Modal
                    title={'设置菜单'}
                    visible={this.state.menuModalShow}
                    closable={false}
                    onCancel={this.setMenuModalVisible.bind(this,false)}
                    onOk={this.handleSetRoleMenu}
                  >   
      			<TreeSet selectedMenuIds={this.state.selectedMenuIds}  getSelectRoleMenu = {this.getSelectRoleMenu.bind(this)}  initTreeNodeData={this.state.initTreeNodeData} ></TreeSet>
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
                    {getFieldDecorator('roleIdModal')(
                      <Input type="hidden" />
                    )}
                </FormItem>
				<FormItem label="角色名称" {...formItemLayout}>
		            {getFieldDecorator('roleNameModal',{
		            	rules : [{
		            		required: true,
		            		message: '请填写角色名称！'
		            	}]
		            })(
		              <Input type="text" placeholder="请输入角色名称" style={{width:200}} />
		            )}
		        </FormItem>
		        <FormItem label="角色编码" {...formItemLayout}>
                    {getFieldDecorator('roleCodeModal',{
                        rules : [{
                            required: true,
                            message: '请填写角色编码！'
                        }]
                    })(
                      <Input type="text"  disabled={disabled} placeholder="请输入角色编码" style={{width:200}} />
                    )}
                </FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);
export default Rolelist;