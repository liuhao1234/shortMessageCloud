import React,{ Component,Fragment } from 'react';
import Axios from '../../axios/index';
import { Table, Icon, Modal, message } from 'antd';

const { confirm } = Modal

class Datatable extends Component{
	constructor(props){
		super(props);
		this.columns = [{ //列数据
			title: '电话号码',
			align:'center',
			dataIndex: 'phone',
		}, {
			title: '机构名称',
			align:'center',
			dataIndex: 'orgName',
		}, {
			title: '创建时间',
			align:'center',
			dataIndex: 'createTime',
		}, {
			title: '加黑类型',
			align:'center',
			dataIndex: 'blacklistType',
		}, {
			title: '操作',
			align:'center',
			dataIndex: 'action',
			render: (text, record) => (
					<Fragment>
						<Icon className="table-btn" type='edit' onClick={this.handleEdit.bind(this,record)} style={{color:'green'}} />
						<Icon className="table-btn" type='delete' onClick={this.handleDelete.bind(this,record)} style={{color:'red'}} />
					</Fragment>
			)
		}]
	}

	state = {
		dataSource : [],
		loading : false,
		pagination : {},
		formValue:{}
	}

	handleEdit = (record)=>{
		this.props.handleEdit(record);
	}

	handleDelete = (record) => {
		confirm({
		    title: '确定删除该条信息吗?',
		    content: `电话号码为:${record.phone},该信息删除后将不能恢复!`,
		    onOk() {
		      	Axios.ajax({
		    		url:'/blacklist/deleteBlacklist',
		    		data:{
						...record
		    		}
		    	}).then((res)=>{
		    		if(res.code === 200){
						message.success(res.message);
		    		}else{
		    			message.error(res.message);
		    		}
		    	})
		    }
		});
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
    					phone:item.phone,
    					orgName:item.orgName,
    					createTime:item.createTime,
    					blacklistType:item.blacklistType
    				}
    			}),
    			pagination
    		})
    	})
    }

    componentWillReceiveProps(nextProps){
    	console.log(nextProps)
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
		console.log("table被渲染")
		return (
			<Fragment>
				<Table 
					columns={this.columns} 
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