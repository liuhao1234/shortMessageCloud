import React,{Component} from 'react';
import 'antd/dist/antd.css';
import './index.css';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

class Home extends Component{

	render() {
		return (
			<div className="root_wraper">
				<Header />
				<Sidebar>
					{this.props.children}
				</Sidebar>
			</div>
		);
	}
}

export default Home;
