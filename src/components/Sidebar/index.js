import React,{Component,Fragment} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

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
						href : '/home/organizations'
					},{
						name : "签名管理",
						href : '/home/signature'
					},{
						name : "模板管理",
						href : '/home/template'
					},{
						name : "通道管理",
						href : '/home/passageway'
					},{
						name : "短信发送明细",
						href : '/home/messages'
					},{
						name : "黑名单管理",
						href : '/home/blacklist'
					}]
		})
	}

	handleSidebarClick(e){
		var navIndex = Number(e.target.getAttribute("index"));
		this.setState({ navIndex });
	}

	initNavList(){
		return this.state.navlist.map((item,index)=>
									<li key={index} className={"num_0"+(index+1)+" "+(this.state.navIndex===index?"active":"")}>
										<Link to={item.href}>
											<span index={index}>{item.name}</span>
										</Link>
									</li>)
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