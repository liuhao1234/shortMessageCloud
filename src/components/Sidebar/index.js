import React,{Component,Fragment} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
//import Axios from '../../axios/index';
import './index.css';
class Sidebar extends Component{
	constructor(props){
		super(props);
		this.state = {
			navIndex : 0
		}
		this.handleSidebarClick = this.handleSidebarClick.bind(this);
	}

	componentWillMount(){
		this.setState({
			navlist : [{
						name : "机构管理",
						className : "organizations",
						href : '/home/organizations'
					},{
						name : "签名管理",
						className:"signature",
						href : '/home/signature'
					},{
						name : "模板管理",
						className:"template",
						href : '/home/template'
					},{
						name : "通道管理",
						className:"passageway",
						href : '/home/passageway'
					},{
						name : "短信发送明细",
						className:"messages",
						href : '/home/messages'
					},{
						name : "黑名单管理",
						className:"blacklist",
						href : '/home/blacklist'
					},{
                        name : "角色管理",
						className:"rolelist",
                        href : '/home/rolelist'
                    },{
                        name : "用户管理",
						className:"userlist",
                        href : '/home/userlist'
                    },{
                        name : "菜单管理",
						className:"menulist",
                        href : '/home/menulist'
                    }]
		})
	}

	handleSidebarClick(e){
		var navIndex = Number(e.target.getAttribute("index"));
		this.setState({ navIndex });
	}

	initNavList(){
		return this.state.navlist.map((item,index)=>
									<li key={index} className={item.className+" "+(this.state.navIndex===index?"active":"")}>
										<Link to={item.href}>
											<span index={index}>{item.name}</span>
										</Link>
									</li>)
	}

	componentDidMount(){
		/*Axios.ajax({
    		url:'/user/queryRoleMenu',
    		data:{},
    	}).then((res)=>{
    		console.log(res)
    		this.setState({
    			options:res
    		})
    	})*/
	}

	render() {
		return (
			<Router>
				<Fragment>
					<div className="psidebar">
						<div className="psidebarinner">
							<div className="sidebar_list">
								<ul onClick={this.handleSidebarClick}>
									{this.initNavList()}
								</ul>
							</div>
						</div>
					</div>
					{this.props.children}
				</Fragment>
			</Router>
		)
	}
}

export default Sidebar;