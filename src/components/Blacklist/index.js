import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, DatePicker, Input } from 'antd';
import SearchForm from './form.js';
import Datatable from './table.js';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;

class Blacklist extends Component{
	state = {
		modalShow : false,
		modalTitle : "",
		formValue : {}
	}

	handleFormSubmit = (e) => {
		e.preventDefault();
		//var formValue = this.formRef.props.form.getFieldsValue();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ 
					formValue:values
				});
			}
	    });
	}

	setModalVisible = (modalShow,modalTitle)=>{
		this.setState({ modalShow, modalTitle });
	}

	handleAddList = ()=>{
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values)
				this.setState({ 
					modalShow:false
				})
			}
	    });
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
									<span className="title_txt">黑名单列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加黑名单")} style={{float:'right'}}><Icon type="plus" />添加黑名单</Button>
								</div>
								<Datatable formValue={this.state.formValue} />
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
				<FormItem label="电话号码" {...formItemLayout}>
		            {getFieldDecorator('phone',{
		            	rules : [{
		            		pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
		            		message: '电话号码格式错误！'
		            	},{
		            		required: true,
		            		message: '请填写电话号码！'
		            	}]
		            })(
		              <Input type="text" placeholder="请输入电话号码" style={{width:200}} />
		            )}
		        </FormItem>
		        <FormItem label="加黑时间" {...formItemLayout}>
		        	{getFieldDecorator('Rangetime',{
		            	rules : [{
		            		required: true,
		            		message: '请选择机构名称'
		            	}]
		            })(
		              <RangePicker />
		            )}
		        </FormItem>
		        <FormItem label="机构名称" {...formItemLayout}>
		        	{getFieldDecorator('orgName',{
		            	rules : [{
		            		required: true,
		            		message: '请选择机构名称'
		            	}]
		            })(
		                <Select placeholder="请选择机构名称" style={{ width: 200 }}>
							<Option value="全部">全部</Option>
							<Option value="北京资采">北京资采</Option>
							<Option value="中国联通">中国联通</Option>
							<Option value="中国移动">中国移动</Option>
							<Option value="中国电信">中国电信</Option>
					    </Select>
		            )}
		        </FormItem>
		        <FormItem label="加黑类型" {...formItemLayout}>
		        	{getFieldDecorator('blacklistType',{
		            	rules : [{
		            		required: true,
		            		message: '请选择加黑类型'
		            	}]
		            })(
		                <Select placeholder="请选择加黑类型" style={{ width: 200 }}>
							<Option value="全部">全部</Option>
							<Option value="北京资采">北京资采</Option>
							<Option value="中国联通">中国联通</Option>
							<Option value="中国移动">中国移动</Option>
							<Option value="中国电信">中国电信</Option>
					    </Select>
		            )}
		        </FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Blacklist;