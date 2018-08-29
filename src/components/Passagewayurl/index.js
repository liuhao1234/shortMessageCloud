import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Input } from 'antd';
import SearchForm from './form.js';
import Datatable from './table.js';
import {message, Radio, Select} from "antd/lib/index";
import Axios from "../../axios";
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


class Passagewayurl extends Component{
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
                debugger;
				let orgName = document.getElementsByClassName("ant-select-selection-selected-value").item(0).innerHTML;
                Axios.ajax({
                    url:'/sign/saveSign/',
                    data:{'signId':values.signId,'signName':values.signName,'orgId':values.orgId,'orgName':orgName,'state':values.state}
                }).then((res)=>{
                    if(res.code === 200){
                    	if(values.signId === undefined){
                            this.formRef.props.form.setFieldsValue({'channelId':'','requestType':'','urlType':'','state':''});
                            values = {'channelId':'','requestType':'','urlType':'','state':''};
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
            url:'/sign/queryById/'+record.key,
            data:{}
        }).then((res)=>{
            if(res.code === 200){
            	debugger;
                _this.setModalVisible(true,"编辑签名");
                _this.modalformRef.props.form.setFieldsValue({
                    signId:res.data.data.signId,
                    signName:res.data.data.signName,
                    orgId:res.data.data.orgId,
                    orgName:res.data.data.orgName,
                    state:res.data.data.state
                });
            }else{
                message.error(res.message);
            }
        })
	}

    getOrgSelect(){
		debugger;
        Axios.ajax({
            url:'/org/queryOrgSelect',
            data:{}
        }).then((res)=>{
            let opts = res.data.data.map(element => <Option key={element.orgId} value={element.orgId}> {element.orgName}</Option>);
            this.setState({options:opts})
        })
    }

	render() {
        //this.getOrgSelect();
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
									<span className="title_txt">签名列表</span>
									<Button type="primary" onClick={this.setModalVisible.bind(this,true,"添加签名")} style={{float:'right'}}><Icon type="plus" />添加通道路径</Button>
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
					{getFieldDecorator('channelUrlId')(
						<Input type="hidden" />
					)}
    			</FormItem>
				<FormItem label="签名名称" {...formItemLayout}>
		            {getFieldDecorator('signName',{
		            	rules : [{
		            		required: true,
		            		message: '请填写签名名称！'
		            	}]
		            })(
		              <Input type="text" placeholder="请输入签名名称" style={{width:280}} />
		            )}
		        </FormItem>
        		<FormItem label="所属通道" {...formItemLayout}>
					{getFieldDecorator('channelId',{
						rules : [{
							required: true,
							message: '请填写所属通道！'
						}]
					})(
						<Select placeholder="请输入所属通道" style={{ width: 280 }}>
							{this.props.options}
						</Select>
					)}
    			</FormItem>
        		<FormItem label="签名状态" {...formItemLayout}>
					{getFieldDecorator('state',{ initialValue: "-1" })(
					    <RadioGroup>
							<Radio value="-1">未上线</Radio>
                            <Radio value="1">已上线</Radio>
                        </RadioGroup>
					)}
    			</FormItem>
			</Form>
		)
	}
}

const ModalFormObj = Form.create()(ModalForm);

export default Passagewayurl;