import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Input } from 'antd';
import SearchForm from './form.js';
import Datatable from './table.js';
import {message, Radio, Select} from "antd/lib/index";
import Axios from "../../axios";

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class Orgurl extends Component{

    constructor(props) {
        super(props);
        this.getOrgSelect();
    }

	state = {
		modalShow : false,
		modalTitle : "",
		formValue : {},
        options : "",
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
				let orgName = document.getElementsByClassName("ant-select-selection-selected-value").item(0).innerHTML;
                Axios.ajax({
                    url:'/orgUrl/saveSmsOrgUrl/',
                    data:{'orgUrlId':values.orgUrlId,'orgId':values.orgId,'orgName':orgName,'orgUrl':values.orgUrl,'urlType':values.urlType,'orgTemplate':values.orgTemplate}
                }).then((res)=>{
                    if(res.code === 200){
                    	if(values.orgUrlId === undefined){
                            this.formRef.props.form.resetFields();
                            values = {'orgId':'','urlType':''};
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
            url:'/orgUrl/queryById/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
            	debugger;
                _this.setModalVisible(true,"编辑机构路径");
                _this.modalformRef.props.form.setFieldsValue({
                    orgUrlId:res.data.data.orgUrlId,
                    orgId:res.data.data.orgId,
                    orgUrl:res.data.data.orgUrl,
                    orgTemplate:res.data.data.orgTemplate,
                    urlType:res.data.data.urlType,
                    state:res.data.data.state
                });
            }else{
                message.error(res.message);
            }
        })
	}

    getOrgSelect(){
        Axios.ajax({
            url:'/org/queryOrgSelect',
            data:{}
        }).then((res)=>{
            let opts = res.data.data.map(element => <Option key={element.orgId} value={element.orgId}> {element.orgName}</Option>);
            this.setState({options:opts})
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
									<span className="title_txt">机构路径列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加机构路径")} style={{float:'right'}}><Icon type="plus" />添加机构路径</Button>
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
      				<ModalFormObj wrappedComponentRef={(form)=> this.modalformRef=form} options={this.state.options}></ModalFormObj>
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
					{getFieldDecorator('orgUrlId')(
						<Input type="hidden" />
					)}
    			</FormItem>
        		<FormItem label="所属机构" {...formItemLayout}>
					{getFieldDecorator('orgId',{
						rules : [{
							required: true,
							message: '请填写所属机构！'
						}]
					})(
						<Select placeholder="请输入所属机构" style={{ width: 280 }}>
							{this.props.options}
						</Select>
					)}
    			</FormItem>
        		<FormItem label="机构路径" {...formItemLayout}>
					{getFieldDecorator('orgUrl',{
						rules : [{
							required: true,
							message: '请填写机构路径！'
						}]
					})(
						<Input type="text" placeholder="请输入机构路径" style={{width:280}} />
					)}
    			</FormItem>
        		<FormItem label="路径类型" {...formItemLayout}>
					{getFieldDecorator('urlType')(
                    <Select placeholder="请选择路径类型" style={{ width: 280 }}>
                        <Option value="PUSH_RESULT_RESULT">PUSH_RESULT_RESULT</Option>
                        <Option value="PUSH_REPLY_RESULT">PUSH_REPLY_RESULT</Option>
					</Select>
					)}
    			</FormItem>
        		<FormItem label="请求参数模板" {...formItemLayout}>
					{getFieldDecorator('orgTemplate',{
						rules : [{
							required: true,
							message: '请填写请求参数模板！'
						}]
					})(
                        <TextArea  placeholder="请输入请求参数模板" autosize={{minRows:2}} style={{width:280}} />
					)}
    			</FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Orgurl;