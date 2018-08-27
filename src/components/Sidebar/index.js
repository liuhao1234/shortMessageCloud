import React,{Component,Fragment} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Axios from '../../axios/index';
import './index.css';
class Sidebar extends Component{
	constructor(props){
		super(props);
		this.state = {
			navIndex : 0
		}
	}

	getNavList = ()=>{
		Axios.ajax({
			url:"/user/queryUserMenu"
		}).then((res)=>{
			if(res.code === 200){
				let navlist = res.data.data.map((item)=>{
					return {
						id:item.menuId,
						name:item.menuName,
						className:item.className,
						href:item.menuUrl,
					}
				})
				console.log(navlist)
				this.setState({ navlist })
			}
		})
	}

	componentWillMount(){
		this.getNavList();
	}

	handleSidebarClick = (e)=>{
		var navIndex = Number(e.target.getAttribute("index"));
		this.setState({ navIndex });
	}

	initNavList = ()=>{
		if(!this.state.navlist) return false;
		return this.state.navlist.map((item,index)=>
									<li key={item.id} className={item.className+" "+(this.state.navIndex===index?"active":"")}>
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