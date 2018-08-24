import React,{Component} from 'react';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';
import { Row, Col, Form, Input, Button, DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class Searchform extends Component{
	shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState);
    }
    
	render(){
		//console.log("查询表单被渲染");
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
									{this.props.orgOptions}
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