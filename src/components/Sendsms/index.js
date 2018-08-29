import React,{Component,Fragment} from 'react';
import { Button, Icon, Form, Modal, Select, DatePicker, Input, message } from 'antd';
import Axios from '../../axios/index';
import SearchForm from './form.js';
import './index.css';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
class Sendsms extends Component{
    constructor(props){
        super(props);
        this.getTemplateSelect();
    }
	state = {
	    options : "",
		loadinge:false
	}
	//获取模板结构下拉信息
	getTemplateSelect(){
        let _this = this
        Axios.ajax({
            url:'/template/queryTemplateSelect/',
            data:{}
        }).then((res)=>{
            let opts = res.data.data.map(
                    (element)=>{
                        return <Option value={element.orgId}>{element.orgName}</Option>});
            _this.setState({options:opts})
        })
    }
	
	//确认发送按钮
	handleFormSubmit = (e) => {
		e.preventDefault();
		//var formValue = this.formRef.props.form.getFieldsValue();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ 
				    selectformValue:values
				});
			}
	    });
	}
	render() {
	    const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        };
		return (
			<Fragment>
				<div className="pmain_con">
					<div className="pmainconinner">
						<div className="search">
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
			                      <Input type="text"  disabled={this.props.disabled} placeholder="请输入角色编码" style={{width:200}} />
			                    )}
			                </FormItem>
			                <FormItem label="备注" {...formItemLayout}>
			                    {getFieldDecorator('remarkModal')(
			                       <TextArea   autosize={{minRows:2}} style={{width:200}} />
			                    )}
			                </FormItem>
			                </Form>	
						</div>						
					</div>
				</div>
			</Fragment>
		)
	}
}

const SendsmsForm = Form.create()(Sendsms);
export default SendsmsForm;