import React,{ Component,Fragment } from 'react';
import Axios from '../../axios/index';
import { Table, Icon, Modal, message } from 'antd';
import _ from 'lodash';
const { confirm } = Modal

class Datatable extends Component{
	constructor(props){
		super(props);
		this.columns = [{ //列数据
			title: '通道名称',
			align:'center',
			dataIndex: 'channelName',
		}, {
            title: '额定发送量',
            align:'center',
            dataIndex: 'channelSt',
        }, {
            title: '额定投诉率',
            align:'center',
            dataIndex: 'channelCr',
        }, {
            title: 'TOPIC名称',
            align:'center',
            dataIndex: 'topicName',
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
                    url:`/channel/deleteSmsChannel/${record.key}`,
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
    		url:'/channel/querychannellist',
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
    					key:item.channelId,
                        channelName:item.channelName,
                        channelSt:item.channelSt,
                        channelCr:item.channelCr,
                        topicName:item.topicName
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
        if(nextProps.formValue.channelId === undefined){
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
        debugger;
    	this.getTableData({
    		pageSize:10,
    		startIndex:1
    	})
    }

	render(){
        debugger;
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