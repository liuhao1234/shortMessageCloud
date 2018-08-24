import React,{Component} from 'react';
import { Modal } from 'antd';
import Utils from './../../utils';

const { confirm } = Modal;

class Header extends Component{
	state = {
		username : "管理员"
	}

	componentDidMount(){
		let username = sessionStorage.getItem("username");
		this.setState({ username });
	}

	handleLogout = ()=>{
		confirm({
		    title: '退出登录',
		    content: '您确定要退出登录么？',
		    onOk() {
        		Utils.logOut();
		    }
  		})
	}

	render() {
		return (
			<div className="phead">
				<div className="head_con">
					<div className="left">
						<span></span> 
						<b>短信云后台系统</b>
					</div>
					<div className="right">
						<span className="user"><small>您好！{this.state.username}</small></span>
						<span className="exit" onClick={this.handleLogout}><small>退出</small></span>
						{/*<a href="/login" className="exit">退出</a>*/}
					</div>
				</div>
			</div>
		)
	}
}

export default Header;