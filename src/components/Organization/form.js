import React,{Component} from 'react';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';
import { Row, Col, Form, Input, Button } from 'antd';
import {Radio, Select} from "antd/lib/index";

const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Searchform extends Component{
    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState);
    }

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