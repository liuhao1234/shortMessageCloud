import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Input } from 'antd';
import SearchForm from './form.js';
import Datatable from './table.js';
import {message, Radio} from "antd/lib/index";
import Axios from "../../axios";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Passageway extends Component{
	state = {
		modalShow : false,
		modalTitle : "",
		formValue : {}
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
		this.modalformRef.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values)
                debugger;
                Axios.ajax({
                    url:'/channel/saveSmsChannel/',
                    data:{'channelId':values.channelId,'channelName':values.channelName,'channelType':values.channelType,'channelSt':values.channelSt,'channelCr':values.channelCr,'state':values.state,'topicName':values.topicName}
                }).then((res)=>{
                    if(res.code === 200){
                    	if(values.channelId === undefined){
                            this.formRef.props.form.setFieldsValue({'channelName':values.channelName,'channelType':values.channelType,'state':values.state});
                            //this.formRef.props.form.resetFields();
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

	handleEdit = (record)=>{
        debugger;
        console.log(record)
        console.log(this)
        console.log(this.modalformRef)
        let _this = this;
        Axios.ajax({
            url:'/channel/queryById/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
                _this.setModalVisible(true,"编辑通道");
                _this.modalformRef.props.form.setFieldsValue({
                    channelId:res.data.data.channelId,
                    channelName:res.data.data.channelName,
                    channelType:res.data.data.channelType,
                    channelSt:res.data.data.channelSt,
                    channelCr:res.data.data.channelCr,
                    state:res.data.data.state,
                    topicName:res.data.data.topicName
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
							<SearchForm wrappedComponentRef={(form)=> this.formRef=form} handleSubmit={this.handleFormSubmit}/>
						</div>
						<div className="pmain_show">
							<div className="common_area">
								<div className="table_title">
									<span className="title_txt">通道列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加通道")} style={{float:'right'}}><Icon type="plus" />添加通道</Button>
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
					{getFieldDecorator('channelId')(
						<Input type="hidden" />
					)}
    			</FormItem>
				<FormItem label="通道名称" {...formItemLayout}>
		            {getFieldDecorator('channelName',{
		            	rules : [{
		            		required: true,
		            		message: '请填写通道名称！'
		            	}]
		            })(
		              <Input type="text" placeholder="请输入通道名称" style={{width:280}} />
		            )}
		        </FormItem>
        		<FormItem label="所属运营商" {...formItemLayout}>
					{getFieldDecorator('channelType',{
						rules : [{
							required: true,
							message: '请填写所属运营商！'
						}]
					})(
						<Input type="text" placeholder="请输入所属运营商" style={{width:280}} />
					)}
    			</FormItem>
			    <FormItem label="额定发送量(条)" {...formItemLayout}>
						{getFieldDecorator('channelSt',{
							rules : [{
								required: true,
								message: '请填写额定发送量！'
							}]
						})(
						  <Input type="text" placeholder="请输入额定发送量" style={{width:280}} />
						)}
		        </FormItem>
		        <FormItem label="额定投诉率(%)" {...formItemLayout}>
						{getFieldDecorator('channelCr',{
							rules : [{
								required: true,
								message: '请填写额定投诉率！'
							}]
						})(
						<Input type="text" placeholder="请输入额定投诉率" style={{width:280}} />
						)}
	            </FormItem>
        		<FormItem label="通道状态" {...formItemLayout}>
					{getFieldDecorator('state',{ initialValue: "1" })(
					<RadioGroup>
					<Radio value="1">开启</Radio>
						<Radio value="0">关闭</Radio>
						</RadioGroup>
					)}
    			</FormItem>
                <FormItem label="备注" {...formItemLayout}>
						{getFieldDecorator('topicName')(
						<Input type="text" placeholder="请输入备注" style={{width:280}} />
						)}
                </FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Passageway;