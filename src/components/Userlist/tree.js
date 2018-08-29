import React,{Component} from 'react';
import { Tree } from 'antd';
import Axios from '../../axios/index';
var TreeNode = Tree.TreeNode;
class TreeSet extends Component{
    getTreeNode(data){
       return data.map((item)=>{
            return (
                <TreeNode  title={item.roleName} key={item.roleId} />
            )
        })
    }
	render(){
		return (
		        <div>
		        <Tree defaultExpandAll={true} onCheck={this.props.getSelectUserRole} checkable={true} checkedKeys={this.props.selectRoleIds} > 
		           <TreeNode  key="0" title="菜单">
		             {this.getTreeNode(this.props.initTreeNodeData)}
		           </TreeNode>
		         </Tree>
		       </div>
		)
	}
}

export default TreeSet;