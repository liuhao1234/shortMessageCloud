import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, DatePicker, Input, message } from 'antd';
import Axios from '../../axios/index';
import SearchForm from './form.js';
import Datatable from './table.js';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
class Menulist extends Component{
	state = {
		modalShow : false,
		modalTitle : "",
        selectformValue : {},
		formValue : {},
		loadinge:false
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
		    this.modalformRef.props.form.resetFields();
		}
	}

	handleAddList = ()=>{
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
			    this.setState({loadinge:true}) 
				console.log(values)
				let _this = this;
				if(values.menuIdModal==null){
				     Axios.ajax({
	                    url:'/menu/save/',
	                    data:{'menuName':values.menuNameModal,
	                        'menuUrl':values.menuUrlModal,
	                        'sort':values.sortModal,
	                        'className':values.classNameModal,
	                        'remark':values.remarkModal
	                        }
	                }).then((res)=>{
	                    _this.setState({loadinge:false})
	                    if(res.code === 200){
	                        message.success(res.message);
	                        values['refresh']=Math.random();
	                        _this.setState({ 
	                            modalShow:false,formValue:values
	                        })
	                        _this.modalformRef.props.form.resetFields();
	                    }else{
	                        message.error(res.message);
	                    }
	                })
	                
				}else{
				    Axios.ajax({
	                    url:'/menu/update/',
	                    data:{'menuId':values.menuIdModal,
	                        'menuName':values.menuNameModal,
	                        'menuUrl':values.menuUrlModal,
	                        'sort':values.sortModal,
                            'className':values.classNameModal,
                            'remark':values.remarkModal
	                        
	                        }
	                }).then((res)=>{
	                    _this.setState({loadinge:false})
	                    if(res.code === 200){
	                        message.success(res.message);
	                        values['refresh']=Math.random();
	                        _this.setState({ 
	                            modalShow:false,formValue:values
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

	handleEdit = (record)=>{
		console.log(record)
		console.log(this)
		console.log(this.modalformRef)
		let _this = this;
		Axios.ajax({
            url:'/menu/get/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
                _this.setModalVisible(true,"编辑菜单");
                _this.modalformRef.props.form.setFieldsValue({
                    menuIdModal:res.data.data.menuId,
                    menuNameModal:res.data.data.menuName,
                    menuUrlModal:res.data.data.menuUrl,
                    sortModal:res.data.data.sort,
                    classNameModal:res.data.data.className,
                    remarkModal:res.data.data.remark
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
									<span className="title_txt">菜单列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加菜单")} style={{float:'right'}}><Icon type="plus" />添加菜单</Button>
								</div>
								<Datatable formValue={this.state.formValue} selectformValue={this.state.selectformValue} handleEdit={this.handleEdit}  />
							</div>
						</div>
					</div>
				</div>
				<Modal
		          title={this.state.modalTitle}
		          visible={this.state.modalShow}
		          closable={false}
				  confirmLoading={this.state.loadinge}   
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
                    {getFieldDecorator('menuIdModal')(
                      <Input type="hidden" />
                    )}
                </FormItem>
				<FormItem label="菜单名称" {...formItemLayout}>
		            {getFieldDecorator('menuNameModal',{
		            	rules : [{
		            		required: true,
		            		message: '请填写菜单名称！'
		            	}]
		            })(
		              <Input type="text" placeholder="请输入菜单名称" style={{width:200}} />
		            )}
		        </FormItem>
		        <FormItem label="菜单URL" {...formItemLayout}>
                    {getFieldDecorator('menuUrlModal',{
                        rules : [{
                            required: true,
                            message: '请填写菜单URL！'
                        }]
                    })(
                      <Input type="text"  placeholder="请输入菜单URL" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="菜单顺序" {...formItemLayout}>
                    {getFieldDecorator('sortModal',{
                        rules : [{
                            required: true,
                            message: '请填写菜单顺序！'
                        }]
                    })(
                      <Input type="text"  placeholder="请输入菜单顺序" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="图标名称" {...formItemLayout}>
                    {getFieldDecorator('classNameModal',{
                        rules : [{
                            required: true,
                            message: '请填写图标名称！'
                        }]
                    })(
                      <Input type="text"  placeholder="请输入图标名称" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {getFieldDecorator('remarkModal')(
                       <TextArea   autosize={{minRows:2}} style={{width:200}} />
                    )}
                </FormItem>
                
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Menulist;