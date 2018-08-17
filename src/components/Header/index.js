import React,{Component} from 'react';

class Header extends Component{
	render() {
		return (
			<div className="phead">
				<div className="head_con">
					<div className="left">
						<span></span> 
						<b>短信云后台系统</b>
					</div>
					<div className="right">
						<span className="user"><small>您好！六六六</small></span>
						<span className="exit"><small>退出</small></span>
					</div>
				</div>
			</div>
		)
	}
}

export default Header;