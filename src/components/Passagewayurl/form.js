import React,{Component} from 'react';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';
import { Row, Col, Form, Input, Button} from 'antd';
import {Radio, Select} from "antd/lib/index";
import Axios from "../../axios";

const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;


class Searchform extends Component{
    constructor(props) {
        super(props);
        this.getchannelSelect();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState);
    }
    state = {
        options : "",
    }

    getchannelSelect(){
        debugger;
    	Axios.ajax({
            url:'/channel/queryChannelSelect',
            data:{}
        }).then((res)=>{
        	let opts = res.data.data.map(element => <Option key={element.channelId} value={element.channelId}> {element.channelName}</Option>);
            this.setState({options:opts})
        })
    }

	render(){
		console.log("查询表单被渲染")
		const { getFieldDecorator } = this.props.form;

		return (
			<Form hideRequiredMark={true} onSubmit={this.props.handleSubmit} layout="inline" className="search-form">
			    <Row>
    				<Col span={24}>
						<FormItem label="通道名称">
            				{getFieldDecorator('channelId')(
								<Select placeholder="请选择所属通道" style={{ width: 200 }}>
		                			{this.state.options}
			 					</Select>
							)}
						</FormItem>
				        <FormItem label="请求类型">
				        	{getFieldDecorator('requestType')(
								<Select placeholder="请选择请求类型" style={{ width: 200 }}>
									<Option value="1">post-json</Option>
									<Option value="2">post</Option>
								</Select>
							)}
						</FormItem>
        				<FormItem label="路径类型">
							{getFieldDecorator('urlType')(
								<Select placeholder="请选择路径类型" style={{ width: 200 }}>
									<Option value="SEND_SMS">SEND_SMS</Option>
									<Option value="SEND_FULL_TEXT_SMS">SEND_FULL_TEXT_SMS</Option>
									<Option value="QUERY_REPLY">QUERY_REPLY</Option>
									<Option value="QUERY_STATE">QUERY_STATE</Option>
								</Select>
							)}
    					</FormItem>
        				<FormItem>
							<Button type="primary" htmlType="submit">查询</Button>
				        </FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit" onClick={(e)=>{e.preventDefault();this.props.form.resetFields()}}>重置</Button>
						</FormItem>
        			</Col>
        		</Row>
		    </Form>
		)
	}
}

export default Form.create()(Searchform);