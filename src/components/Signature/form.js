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
        this.getOrgSelect();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState);
    }

    state = {
        options : "",
    }

    getOrgSelect(){
        debugger;
    	Axios.ajax({
            url:'/org/queryOrgSelect',
            data:{}
        }).then((res)=>{
        	let opts = res.data.data.map(element => <Option key={element.orgId} value={element.orgId}> {element.orgName}</Option>);
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
	    				<FormItem label="签名名称">
				            {getFieldDecorator('signName')(
				              <Input type="text" placeholder="请输入签名名称" style={{width:200}} />
				            )}
				        </FormItem>
						<FormItem label="所属机构">
            				{getFieldDecorator('orgId')(
								<Select placeholder="请选择所属机构" style={{ width: 200 }}>
    								<Option value="">不限</Option>
		                			{this.state.options}
			 					</Select>
							)}
						</FormItem>
				        <FormItem label="签名状态">
				        	{getFieldDecorator('state')(
								<Select placeholder="请选择签名状态" style={{ width: 200 }}>
									<Option value="">不限</Option>
									<Option value="-1">未上线</Option>
									<Option value="1">已上线</Option>
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