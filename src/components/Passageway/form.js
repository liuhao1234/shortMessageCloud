import React,{Component} from 'react';
import { Row, Col, Form, Input, Button} from 'antd';
import {Radio, Select} from "antd/lib/index";

const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Searchform extends Component{
	render(){
		console.log("查询表单被渲染")
		const { getFieldDecorator } = this.props.form;
		return (
			<Form hideRequiredMark={true} onSubmit={this.props.handleSubmit} layout="inline" className="search-form">
			    <Row>
    				<Col span={24}>
	    				<FormItem label="通道名称">
				            {getFieldDecorator('channelName')(
				              <Input type="text" placeholder="请输入通道名称" style={{width:200}} />
				            )}
				        </FormItem>
						<FormItem label="所属运营商">
            				{getFieldDecorator('channelType')(
								<Select placeholder="请选择所属运营商" style={{ width: 200 }}>
									<Option value="">请选择</Option>
			 					</Select>
							)}
						</FormItem>
				        <FormItem label="通道状态">
				        	{getFieldDecorator('state',{ initialValue: "1" })(
								<Select placeholder="请选择通道状态" style={{ width: 200 }}>
									<Option value="1">开启</Option>
									<Option value="0">关闭</Option>
								</Select>
				            )}
				        </FormItem>
    				</Col>
    			</Row>
        		<Row>
        			<Col>
        				<FormItem>
							<Button type="primary" htmlType="submit">查询</Button>
				        </FormItem>
        			</Col>
        		</Row>
		    </Form>
		)
	}
}

export default Form.create()(Searchform);