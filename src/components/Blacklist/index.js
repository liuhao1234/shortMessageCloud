import React,{Component,Fragment} from 'react';
import { Button, Icon } from 'antd';
import Form from './form.js';
import Datatable from './table.js';
import Poppanel from '../Poppanel';
import './index.css';

class Blacklist extends Component{
	state = {
		formValue : {}
	}

	handleFormSubmit = (e) => {
		e.preventDefault();
		//var formValue = this.formRef.props.form.getFieldsValue();
		this.formRef.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ 
					formValue:values
				});
			}
	    });
	}



	render() {
		return (
			<Fragment>
				<div className="pmain_con">
					<div className="pmainconinner">
						<div className="search">
							<Form wrappedComponentRef={(form)=> this.formRef=form} handleSubmit={this.handleFormSubmit} />
						</div>
						<div className="pmain_show">
							<div className="common_area">
								<div className="table_title">
									<span className="title_txt">黑名单列表</span>
									<Button type="primary" style={{float:'right'}}><Icon type="plus" />添加黑名单</Button>
								</div>
								<Datatable formValue={this.state.formValue} />
							</div>
						</div>
					</div>
				</div>
				<Poppanel title="黑名单列表">
					
				</Poppanel>
			</Fragment>
		)
	}
}

export default Blacklist;