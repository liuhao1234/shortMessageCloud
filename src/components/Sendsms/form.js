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
				        <FormItem label="用户姓名">
                            {getFieldDecorator('userName')(
                              <Input type="text" placeholder="请输入用户姓名" style={{width:200}} />
                            )}
                        </FormItem>
                        <FormItem label="登录账号">
                            {getFieldDecorator('loginCode')(
                              <Input type="text" placeholder="请输入登录账号" style={{width:200}} />
                            )}
                        </FormItem>
    				</Col>
    			</Row>
        		<Row>
        			<Col>
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