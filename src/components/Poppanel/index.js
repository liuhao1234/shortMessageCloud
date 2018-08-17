import React,{Component} from 'react';
import { Button } from 'antd';
import './index.css';

class Poppanel extends Component{
	static defaultProps = {
		show : false,
		title : "标题"
	}

	render(){
		return (
			<div className="panel-wraper" style={{display:this.props.show?"block":"none"}}>
				<div className="panel-main">
					<div className="panel-head">
						<span>{this.props.title}</span>
						<i onClick={this.props.close}></i>
					</div>
					<div className="panel-body">
						{this.props.children}
					</div>
					<div className="panel-foot">
						<Button type="primary" style={{margin:'0 5px'}}>确定</Button>
						<Button onClick={this.props.close} type="primary" style={{margin:'0 5px'}}>取消</Button>
					</div>
				</div>
			</div>
		)
	}
}

export default Poppanel