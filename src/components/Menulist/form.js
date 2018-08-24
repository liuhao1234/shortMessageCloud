import React,{Component} from 'react';
import { Row, Col, Form, Input, Button, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
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
	    				<FormItem label="菜单名称">
				            {getFieldDecorator('menuName')(
				              <Input type="text" placeholder="请输入菜单名称" style={{width:200}} />
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