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
				            		pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
				            		message: '电话号码格式错误！'
				            	}]
				            })(
				              <Input type="text" placeholder="请输入电话号码" style={{width:200}} />
				            )}
				        </FormItem>
				        <FormItem label="加黑时间">
				        	{getFieldDecorator('Rangetime')(
				              <RangePicker />
				            )}
				        </FormItem>
				        <FormItem label="机构名称">
				        	{getFieldDecorator('orgName')(
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