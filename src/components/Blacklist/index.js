import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, Input, message } from 'antd';
import Axios from '../../axios/index';
import SearchForm from './form.js';
import Datatable from './table.js';
import './index.css';

const { Option } = Select;
const FormItem = Form.Item;

class Blacklist extends Component{
	state = {
		modalShow : false,
		modalTitle : "",
		newId:"",
		formValue : {},
		userInfo : {}
	}

	handleSearch = (e) => {
		e.preventDefault();
		//var formValue = this.formRef.props.form.getFieldsValue();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
				//console.log(values);
				this.setState({ 
					formValue:values
				});
			}
	    });
	}

	setModalVisible = (modalShow,modalTitle)=>{
		this.setState({ modalShow, modalTitle, userInfo:{} });
	}

	handleAddList = ()=>{
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
				//console.log(values)
				//console.log(this.state.userInfo)
		    	if(this.state.modalTitle == "添加黑名单"){
			    	Axios.ajax({
			    		url:'/blacklist/saveBlacklist',
			    		data:{
			    			phone:values.phone,
			    			orgId:values.orgName.split("-")[0],
			    			orgName:values.orgName.split("-")[1],
			    			blacklistType:values.blacklistType,
			    			state:1
			    		}
			    	}).then((res)=>{
			    		//console.log(res)
			    		if(res.code === 200){
			    			var newId = Math.random();
			    			this.setState({
				    			newId,
				    			modalShow:false
				    		})
			    			message.success(res.message);
			    		}else{
			    			message.warning(res.message);
			    		}
			    	})
		    	}else if(this.state.modalTitle == "编辑黑名单"){
		    		Axios.ajax({
			    		url:'/blacklist/saveBlacklist',
			    		data:{
			    			blacklistId:this.state.userInfo.key,
			    			phone:values.phone,
			    			orgId:values.orgName.split("-")[0],
			    			orgName:values.orgName.split("-")[1],
			    			blacklistType:values.blacklistType=="手动添加"?0:1,
			    			state:1
			    		}
			    	}).then((res)=>{
			    		//console.log(res)
			    		if(res.code === 200){
			    			var newId = Math.random();
				    		this.setState({
				    			newId,
				    			modalShow:false
				    		})
			    			message.success(res.message);
			    		}else{
			    			message.warning(res.message);
			    		}
			    		this.modalformRef.props.form.resetFields();
			    	})
		    	}
			}
	    });
	}

	handleEdit = (record)=>{
		//console.log(record)
		this.setState({ 
			modalTitle:"编辑黑名单",
			userInfo : record,
			modalShow:true
		})
	}

	initSelect = (data)=>{
		return data.map((item)=>{
			return <Option key={item.orgId} value={`${item.orgId}-${item.orgName}`}>{item.orgName}</Option>
		})
	}

	componentWillMount(){
		var _this = this;
		Axios.ajax({
    		url:'/org/queryOrgSelect',
    		data:{},
    	}).then((res)=>{
    		//console.log(res)
    		if(res.code === 200){
    			//console.log(res.data)
    			_this.setState({
	    			orgOptions:_this.initSelect(res.data.data)
	    		})
    		}else{
    			message.warning(res.message)
    		}
    		
    	})
	}

	render() {
		//console.log("index被渲染")
		return (
			<Fragment>
				<div className="pmain_con">
					<div className="pmainconinner">
						<div className="search">
							<SearchForm orgOptions={this.state.orgOptions} wrappedComponentRef={(form)=> this.formRef=form} handleSubmit={this.handleSearch} />
						</div>
						<div className="pmain_show">
							<div className="common_area">
								<div className="table_title">
									<span className="title_txt">黑名单列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加黑名单")} style={{float:'right'}}><Icon type="plus" />添加黑名单</Button>
								</div>
								<Datatable addNew={this.state.newId} formValue={this.state.formValue} handleEdit={this.handleEdit} />
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
      				<ModalFormObj userInfo={this.state.userInfo} orgOptions={this.state.orgOptions} wrappedComponentRef={(form)=> this.modalformRef=form}></ModalFormObj>
		        </Modal>
			</Fragment>
		)
	}
}


class ModalForm extends Component{
	render(){
		//console.log("ModalForm被渲染")
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
		            	initialValue:this.props.userInfo.phone,
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
		       
		        <FormItem label="机构名称" {...formItemLayout}>
		        	{getFieldDecorator('orgName',{
		        		initialValue:this.props.userInfo.orgName,
		            	rules : [{
		            		required: true,
		            		message: '请选择机构名称'
		            	}]
		            })(
		                <Select placeholder="请选择机构名称" style={{ width: 200 }}>
		                	{ this.props.orgOptions }
					    </Select>
		            )}
		        </FormItem>
		        <FormItem label="加黑类型" {...formItemLayout}>
		        	{getFieldDecorator('blacklistType',{
		        		initialValue:this.props.userInfo.blacklistType,
		            	rules : [{
		            		required: true,
		            		message: '请选择加黑类型'
		            	}]
		            })(
		                <Select placeholder="请选择加黑类型" style={{ width: 200 }}>
							<Option value={0}>手工添加</Option>
							<Option value={1}>系统添加</Option>
					    </Select>
		            )}
		        </FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Blacklist;