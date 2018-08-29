import React,{ Component,Fragment } from 'react';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';
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
			render: (text, record) => {
				return (
					<Fragment>
						<Icon className="table-btn" type='edit' onClick={this.handleEdit.bind(this,record)} style={{color:'green'}} />
						<Icon className="table-btn" type='delete' onClick={this.handleDelete.bind(this,record)} style={{color:'red'}} />
					</Fragment>
			)}
		}]
	}

	state = {
		dataSource : [],
		loading : false,
		pagination : {
			pageSize:10,
			current:1
		},
		formValue:{}
	}

	handleEdit = (record)=>{
		this.props.handleEdit(record);
	}

	handleDelete = (record) => {
		let _this = this;
		confirm({
		    title: '确定删除该条信息吗?',
		    content: `电话号码为:${record.phone},该信息删除后将不能恢复!`,
		    onOk() {
		      	Axios.ajax({
		    		url:`blacklist/deleteBlacklist/${record.key}`,
		    		data:{}
		    	}).then((res)=>{
		    		if(res.code === 200){
		    			//console.log(_this.state)
		    			_this.getTableData();
						message.success(res.message);
		    		}else{
		    			message.error(res.message);
		    		}
		    	})
		    }
		});
	}

	handleTableChange = (pagination) => {
		this.setState({
			pagination : {
				pageSize:pagination.pageSize,
				current:pagination.current
			}
		},()=>{
			this.getTableData();
		})
    }

    getTableData(params){
    	//console.log(this.props.formValue)
    	//console.log(this.state.formValue.Rangetime?this.state.formValue.Rangetime[0].format("YYYY-MM-DD"):"")
    	const _this = this;
    	if(!params){
    		params = {
    			pageSize:_this.state.pagination.pageSize,
				startIndex:1
    		}
    	}
    	this.setState({ loading: true });
    	Axios.ajax({
    		url:'/blacklist/queryBlacklist',
    		data:{
    			...params,
    			...this.state.formValue,
    			startTime:this.state.formValue.Rangetime?this.state.formValue.Rangetime[0].format("YYYY-MM-DD"):"",
    			endTime:this.state.formValue.Rangetime?this.state.formValue.Rangetime[1].format("YYYY-MM-DD"):"",
    			orgId:this.state.formValue.orgName?this.state.formValue.orgName.split("-")[0]:"",
    			orgName:this.state.formValue.orgName?this.state.formValue.orgName.split("-")[1]:"",
    		}
    	}).then((res)=>{
    		//console.log(res)
    		const   pagination = { 
    					..._this.state.pagination,
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

    componentWillMount(){
    	this.setState({
    		formValue:this.props.formValue
    	})
    }

    componentWillReceiveProps(nextProps, nextState){
    	//console.log(nextProps.formValue);
    	if(!shallowEqualImmutable(this.props, nextProps)){
    		this.setState({
    			formValue:nextProps.formValue
    		},()=>{
    			this.getTableData();
    		})
    	}
    }

    shouldComponentUpdate(nextProps, nextState) {
    	//console.log(!shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState))
        return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState);
    }

    componentDidMount(){
    	this.getTableData();
    }

	render(){
		//console.log("table被渲染")
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