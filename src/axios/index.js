import axios from 'axios';
import { Modal, message } from 'antd';
//import Utils from '../utils';
message.config({
  duration: 2,
  maxCount: 1,
});
//Utils.logOut();
export default class Axios {
	static ajax(options){
		//const baseURL = "http://192.168.100.10:9696";
		const baseURL = " https://www.easy-mock.com/mock/5b73e7f8a364536777acd8c2";
		const token = sessionStorage.getItem("beautifulGirl");

		return new Promise((resolve,reject)=>{
			axios({
				method:'post',
				baseURL,
				url:options.url,
				data:options.data,
				headers:{
					'Content-Type': 'application/json',
					token
				}
			}).then((response)=>{
				//console.log(response)
				if(response.status === 200){//http返回的200
					let res = response.data;
					if(res.code === 200){//code是501的时候请求超时
						resolve(response.data);
						sessionStorage.setItem("beautifulGirl",res.token);
					}else{
						message.warning(res.message);
					}
				}else{
					//链接失败
					reject(response.data);
					//弹窗提示
			        Modal.error({
			            title: '网络链接失败',
			            content: response.statusText,
			        });
				}
			})
		})
	}
}