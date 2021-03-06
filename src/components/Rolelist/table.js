import React,{ Component,Fragment } from 'react';
import Axios from '../../axios/index';
import { Table, Icon, Modal, message } from 'antd';
import _ from 'lodash';
const { confirm } = Modal

class Datatable extends Component{
	constructor(props){
		super(props);
		this.columns = [{ //列数据
			title: '角色名称',
			align:'center',
			dataIndex: 'roleName',
		}, {
			title: '角色编码',
			align:'center',
			dataIndex: 'roleCode',
		}, {
			title: '创建时间',
			align:'center',
			dataIndex: 'createTime',
			title: '操作',
			align:'center',
			dataIndex: 'action',
			render: (text, record) => (
					<Fragment>
					    <Icon className="table-btn" type='menu-unfold' onClick={this.handleSetMenu.bind(this,record)} style={{color:'blue'}} />
						<Icon className="table-btn" type='edit' onClick={this.handleEdit.bind(this,record)} style={{color:'green'}} />
						<Icon className="table-btn" type='delete' onClick={this.handleDelete.bind(this,record)} style={{color:'red'}} />
					</Fragment>
			)
		}]
	}

	state = {
	    refresh : "",
		dataSource : [],
		loading : false,
		pagination : {},
		selectformValue:{}
	}

	shouldComponentUpdate(nextProps, nextState) {
	    if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
	        return true
	     } else {
	        return false
	     }
	}
	
	handleEdit = (record)=>{
		this.props.handleEdit(record);
	}
	
	handleSetMenu = (record)=>{
        this.props.handleSetMenu(record);
    }

	handleDelete = (record) => {
	    const _this=this;
		confirm({
		    title: '确定删除该条信息吗?',
		    content: `该信息删除后将不能恢复!`,
		    onOk() {
		      	Axios.ajax({
		    		url:'/role/del/'+record.key,
		    		data:{}
		    	}).then((res)=>{
		    		if(res.code === 200){
						message.success(res.message);
						_this.componentDidMount();
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
    		url:'/role/query',
    		data:{
    			...params,
    			...this.state.selectformValue
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
    					key:item.roleId,
    					roleName:item.roleName,
    					roleCode:item.roleCode,
    					createTime:item.createTime
    				}
    			}),
    			pagination
    		})
    	})
    }

    componentWillReceiveProps(nextProps){
        if (_.isEqual(this.props, nextProps)) {
            return;
         }
    	console.log(nextProps)
    	this.setState({
    	    selectformValue:nextProps.selectformValue
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