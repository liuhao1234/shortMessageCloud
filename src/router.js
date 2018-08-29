import React,{ Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import App from './App';
import Login from './pages/Login';
import Home from './pages/Home';
import Welcome from './components/Welcome';
import Organization from './components/Organization';
import Signature from './components/Signature';
import Template from './components/Template';
import Passageway from './components/Passageway';
import Messages from './components/Messages';
import Blacklist from './components/Blacklist';
import Rolelist from './components/Rolelist';
import Userlist from './components/Userlist';
import Menulist from './components/Menulist';
import Orgurl from './components/Orgurl';
import Sendsms from './components/Sendsms';
import Passagewayurl from './components/Passagewayurl';
import Nomatch from './components/Nomatch';
class IRouter extends Component{
	render(){
		return (
			<LocaleProvider locale={zh_CN}>
				<Router>
					<App>
						<Route exact path="/" component={Login}></Route>
						<Route path="/login" component={Login}></Route>
						<Route path="/home" render={({match})=>{
							let token = sessionStorage.getItem("beautifulGirl");
							if(token){
								let pathBase = match.path;
								return (<Router>
									<Home>
										<Switch>
											<Route exact path={pathBase} component={Welcome}/>
											<Route path={pathBase+"/organizations"} component={Organization}/>
											<Route path={pathBase+"/signature"} component={Signature}/>
											<Route path={pathBase+"/template"} component={Template}/>
											<Route path={pathBase+"/passageway"} component={Passageway}/>
											<Route path={pathBase+"/messages"} component={Messages}/>
											<Route path={pathBase+"/blacklist"} component={Blacklist}/>
											<Route path={pathBase+"/rolelist"} component={Rolelist}/>
										    <Route path={pathBase+"/userlist"} component={Userlist}/>
										    <Route path={pathBase+"/menulist"} component={Menulist}/>
	                                		<Route path={pathBase+"/orgurl"} component={Orgurl}/>
	                                		<Route path={pathBase+"/sendsms"} component={Sendsms}/>
	                                		<Route path={pathBase+"/passagewayurl"} component={Passagewayurl}/>
	                                		<Route component={Nomatch}/>
	                                	</Switch>
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