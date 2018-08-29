import React,{Component} from 'react';
import { Tree } from 'antd';
import Axios from '../../axios/index';
var TreeNode = Tree.TreeNode;
class TreeSet extends Component{
    getTreeNode(data){
       return data.map((item)=>{
            return (
                <TreeNode  title={item.menuName} key={item.menuId} />
            )
        })
    }
	render(){
		return (
		        <div>
		        <Tree defaultExpandAll={true} onCheck={this.props.getSelectRoleMenu} checkable={true} checkedKeys={this.props.selectMenuIds} > 
		           <TreeNode  key="0" title="菜单">
		             {this.getTreeNode(this.props.initTreeNodeData)}
		           </TreeNode>
		         </Tree>
		       </div>
		)
	}
}

export default TreeSet;