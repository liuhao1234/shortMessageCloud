import React,{ Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import App from './App';
import Login from './pages/Login';
import Home from './pages/Home';
import Organization from './components/Organization';
import Signature from './components/Signature';
import Template from './components/Template';
import Passageway from './components/Passageway';
import Messages from './components/Messages';
import Blacklist from './components/Blacklist';

class IRouter extends Component{
	render(){
		return (
			<LocaleProvider locale={zh_CN}>
				<Router>
					<App>
						<Route exact path="/" component={Login}></Route>
						<Route path="/login" component={Login}></Route>
						<Route path="/home" render={(match)=>{
							let token = sessionStorage.getItem("beautifulGirl");
							if(token){
								let pathBase = match.match.path;
								return (<Router>
									<Home>
										<Route exact path={pathBase} component={Organization}/>
										<Route path={pathBase+"/organizations"} component={Organization}/>
										<Route path={pathBase+"/signature"} component={Signature}/>
										<Route path={pathBase+"/template"} component={Template}/>
										<Route path={pathBase+"/passageway"} component={Passageway}/>
										<Route path={pathBase+"/messages"} component={Messages}/>
										<Route path={pathBase+"/blacklist"} component={Blacklist}/>
									</Home>
								</Router>)
							}else{
								return (
									<Redirect to="/login"/>
								)
							}
						}}></Route>
					</App>
				</Router>
			</LocaleProvider>
		);
	}
}
export default IRouter;