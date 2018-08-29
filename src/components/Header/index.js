import React,{Component} from 'react';
import { Input, Button,Form,Modal, message } from 'antd';
import Axios from '../../axios/index';
import Utils from './../../utils';

const { confirm } = Modal;
const FormItem = Form.Item;
class Header extends Component{
	state = {
		username : "管理员",
		modalShow:false,
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
	
	handleUpdatePassword = ()=>{
	    let _this = this;
	    this.modalformRef.props.form.validateFields((err, values) => {
            if (!err) {
                Axios.ajax({
                    url:'/user/updatePassword/',
                    data:{'password':values.oldPs,'newPassword':values.newPs,'confirmPassword':values.confirmPs}
                }).then((res)=>{
                    if(res.code === 200){
                        message.success(res.message);
                        _this.modalformRef.props.form.resetFields();
                        _this.setModalVisible(false);
                    }else{
                        message.error(res.message);
                    }
                })
            }
        });
    }

	setModalVisible(modalShow){
	    this.setState({modalShow});
	    if(!modalShow)
	    this.modalformRef.props.form.resetFields();
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
						<span onClick={this.setModalVisible.bind(this,true)}><small>修改密码</small></span>
						<span className="exit" onClick={this.handleLogout}><small>退出</small></span>
						{/*<a href="/login" className="exit">退出</a>*/}
					</div>
				</div>
				<Modal
                  title={'修改密码'}
                  visible={this.state.modalShow}
                  closable={false}
                  onCancel={this.setModalVisible.bind(this,false)}
                  onOk={this.handleUpdatePassword}
                >
                    <ModalFormObj  wrappedComponentRef={(form)=> this.modalformRef=form}></ModalFormObj>
                </Modal>
			</div>
		)
	}
}
class ModalForm extends Component{
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            },
        };
        return(
            <Form hideRequiredMark={true}>
                <FormItem  {...formItemLayout}>
                    {getFieldDecorator('userIdModal')(
                      <Input type="hidden" />
                    )}
                </FormItem>
                <FormItem label="原密码" {...formItemLayout}>
                    {getFieldDecorator('oldPs',{
                        rules:[{
                            required: true,
                            message: '请填写原密码！'
                        }]
                    })(
                      <Input type="text" disabled={this.props.disabled} placeholder="请输入原密码" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="新密码" {...formItemLayout}>
                    {getFieldDecorator('newPs',{
                        rules : [{
                            pattern: /^\w{6,20}$/,
                            message: '由6-20位的字母、数字、下划线组成！'
                        },{
                            required: true,
                            message: '请填写新密码！'
                        }]
                    })(
                      <Input type="text" disabled={this.props.disabled} placeholder="请输入新密码" style={{width:200}} />
                    )}
                </FormItem>
                <FormItem label="确认新密码" {...formItemLayout}>
                    {getFieldDecorator('confirmPs',{
                        rules : [{
                            pattern: /^\w{6,20}$/,
                            message: '由6-20位的字母、数字、下划线组成！'
                        },{
                            required: true,
                            message: '请填写确认新密码！'
                        }]
                    })(
                      <Input type="text" disabled={this.props.disabled} placeholder="请输入确认新密码" style={{width:200}} />
                    )}
                </FormItem>
            </Form>
        )
    }
}

const ModalFormObj = Form.create()(ModalForm);
export default Header;