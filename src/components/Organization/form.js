import React,{Component} from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
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
	    				<FormItem label="机构名称">
				            {getFieldDecorator('orgName')(
				              <Input type="text" placeholder="请输入机构名称" style={{width:200}} />
				            )}
				        </FormItem>
				        <FormItem label="认证状态">
				        	{getFieldDecorator('state',{ initialValue: "1" })(
                                /*<RadioGroup>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </RadioGroup>*/
								<Select placeholder="请选择认证状态" style={{ width: 200 }}>
									<Option value="1">是</Option>
									<Option value="0">否</Option>
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