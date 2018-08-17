import React, { Component,Fragment } from 'react';
import axios from 'axios';
import { Modal, Button, message } from 'antd';
import LoginBg from '../../assets/images/login_bg.jpg';
import Syslogo from '../../assets/images/sys_logo.png';
import Loginpc from '../../assets/images/login_pc.png';
import './index.css';
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  state = {
    loading : false,
    username : '',
    password : '',
  };

  handleUserChange(e) {
    this.setState({
        username:e.target.value
    });
  }

  handlePassChange(e) {
    this.setState({
        password:e.target.value
    });
  }

  handleSubmit() {
    let _this = this;
    //判断用户名是否为空
    if(!_this.state.username){
      message.warning('用户名不能为空');
      return false;
    }
    //判断密码是否为空
    if(!_this.state.password){
      message.warning('密码不能为空');
      return false;
    }

    //向后台发送请求
    _this.setState({ loading:true });

    axios.post('http://192.168.100.10:9696/login',{
      'loginCode':this.state.username,
      'password':this.state.password
    }).then(function(response){
      _this.setState({ loading:false });
      if(response.status === 200){
        let res = response.data;
        if(res.code === 200){
          //登录成功
          message.success(res.message);
          sessionStorage.setItem("beautifulGirl",res.token);
          _this.props.history.push('/home');
        }else{
          //登录失败
          message.warning(res.message);
        }
      }else{
        //链接失败
        Modal.error({
          title: '链接失败',
          content: response.statusText,
        });
      }
    })
  }

  componentDidMount() {
    const _self = this;
    document.addEventListener('keyup',function(e){
      if(e.keyCode === 13) {
        _self.handleSubmit();
      }
    });
  }

  render() {
    return (
      <Fragment>
        <div className="login_bg">
          <img className="login_bg_pic" src={LoginBg} alt="" />
          <div className="main">
            <img className="sys_logo" src={Syslogo} alt="" />  
            <img className="login_pc" src={Loginpc} alt="" />   
            <div className="login_form">
              <h4 className="form_header">用户登录 login</h4>
              <input className="username login_input" type="text" onChange={this.handleUserChange} placeholder="请输入用户名" name="" />
              <input className="password login_input" type="password" onChange={this.handlePassChange} placeholder="请输入密码" name="" />
              <Button style={{margin:"0 20px",width:300,height:40}} type="primary" onClick={this.handleSubmit} loading={this.state.loading} disabled={this.state.loading}>确定</Button>
            </div>
          </div>
        </div>
        <div className="copyright">
          Copyright © 2018-2099 北京资采<br/>All Rights Reserved 北京资采
        </div>
        
      </Fragment>
    );
  }
}

export default Login;
