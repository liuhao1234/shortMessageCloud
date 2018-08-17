import React,{Component,Fragment} from 'react';
import Axios from '../../axios/index';
import { Table, Icon } from 'antd';

const columns = [{ //列数据
	title: '电话号码',
	align:'center',
	dataIndex: 'phoneNum',
}, {
	title: '机构名称',
	align:'center',
	dataIndex: 'companyName',
}, {
	title: '创建时间',
	align:'center',
	dataIndex: 'createTime',
}, {
	title: '加黑类型',
	align:'center',
	dataIndex: 'blackType',
}, {
	title: '操作',
	align:'center',
	dataIndex: 'action',
	render: (text, record) => (
			<Fragment>
				<Icon type="edit" style={{fontSize:18,color:'green'}} />
				<Icon type="delete" style={{fontSize:18,color:'red'}} />
			</Fragment>
	)
}]

class Datatable extends Component{
	state = {
		dataSource : [],
		loading : false,
		pagination : {},
		formValue:{}
	}

	handleTableChange = (pagination) => {
	    this.getTableData({
	        pageSize: pagination.pageSize,
	        startIndex: pagination.current
	    });
    }

    getTableData(params){
    	this.setState({ loading: true });
    	/*console.log({
    			...params,
    			...this.state.formValue
    		})*/
    	Axios.ajax({
    		url:'/blacklist/queryBlacklist',
    		data:{
    			...params,
    			...this.state.formValue
    		}
    	}).then((res)=>{
    		//console.log(res)
    		const   pagination = { 
    					...this.state.pagination,
		    			total : res.data.recordsTotal
		    		};
    		this.setState({
    			loading: false,
    			dataSource:res.data.data.map((item)=>{
    				return {
    					key:item.blacklistId,
    					phoneNum:item.phone,
    					companyName:item.orgName,
    					createTime:item.createTime,
    					blackType:item.blacklistType
    				}
    			}),
    			pagination
    		})
    	})
    }

    componentWillReceiveProps(nextProps){
    	this.setState({
    		formValue:nextProps.formValue
    	},()=>{
    		this.getTableData({
	    		pageSize:10,
	    		startIndex:1
	    	})
    	})
    }

    componentDidMount(){
    	this.getTableData({
    		pageSize:10,
    		startIndex:1
    	})
    }

	render(){
		return (
			<Fragment>
				<Table 
					columns={columns} 
					dataSource={this.state.dataSource} 
					pagination={this.state.pagination} 
					size="small" 
					bordered={true}
					loading={this.state.loading}
					onChange={this.handleTableChange}
				/>
			</Fragment>
		)
	}
}
export default Datatable;