import React,{ Component,Fragment } from 'react';
import Axios from '../../axios/index';
import { Table, Icon, Modal, message } from 'antd';
import _ from 'lodash';
const { confirm } = Modal

class Datatable extends Component{
	constructor(props){
		super(props);
		this.columns = [{ //列数据
			title: '机构名称',
			align:'center',
			dataIndex: 'orgName',
		}, {
			title: '机构账号',
			align:'center',
			dataIndex: 'appkey',
		}, {
            title: '机构密码',
            align:'center',
            dataIndex: 'appsecret',
        }, {
			title: '认证状态',
			align:'center',
			dataIndex: 'state',
		}, {
            title: '对接人姓名',
            align:'center',
            dataIndex: 'orgContactName',
        }, {
            title: '对接人邮箱',
            align:'center',
            dataIndex: 'orgContactMail',
        }, {
            title: '对接人电话',
            align:'center',
            dataIndex: 'orgContactPhone',
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
        refresh : "",
		dataSource : [],
		loading : false,
		pagination : {},
		formValue:{}
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

	handleDelete = (record) => {
        const _this=this;
		confirm({
		    title: '确定删除该条信息吗?',
		    content: `该信息删除后将不能恢复!`,
		    onOk() {
                Axios.ajax({
                    url:`/org/deleteSmsOrg/${record.key}`,
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
    	Axios.ajax({
    		url:'/org/queryOrglist',
    		data:{
    			...params,
    			...this.state.formValue
    		}
    	}).then((res)=>{
    		const   pagination = { 
    					...this.state.pagination,
		    			total : res.data.recordsTotal
		    		};
    		this.setState({
    			loading: false,
    			dataSource:res.data.data.map((item)=>{
    				return {
    					key:item.orgId,
    					orgName:item.orgName,
                        appkey:item.appkey,
                        appsecret:item.appsecret,
    					state:item.state,
                        orgAddress:item.orgAddress,
                        orgContactName:item.orgContactName,
                        orgContactMail:item.orgContactMail,
                        orgContactPhone:item.orgContactPhone,
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

        let _formValue = this.state.formValue;
        if(nextProps.formValue.orgId === undefined){
            _formValue = nextProps.formValue;
        }
        this.setState({
            formValue:_formValue
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