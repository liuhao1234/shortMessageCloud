import React,{Component} from 'react';
import { Row, Col, Form, Input, Button, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;

class Searchform extends Component{
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<Form hideRequiredMark={true} onSubmit={this.props.handleSubmit} layout="inline" className="search-form">
    			<Row>
    				<Col span={24}>
	    				<FormItem label="电话号码">
				            {getFieldDecorator('phone',{
				            	rules : [{
				            		required: true,
				            		message: '手机号码不能为空'
				            	}]
				            })(
				              <Input type="text" placeholder="请输入电话号码" style={{width:200}} />
				            )}
				        </FormItem>
				        <FormItem label="加黑时间">
				        	{getFieldDecorator('Rangetime',{
				            	rules : [/*{required: true, message: '请选择加黑时间!'}*/]
				            })(
				              <RangePicker />
				            )}
				        </FormItem>
				        <FormItem label="机构名称">
				        	{getFieldDecorator('orgName',{
				            	rules : [/*{required: true, message: '请选择机构名称!'}*/]
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