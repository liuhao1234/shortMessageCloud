export default class Utils {
	static logOut(_this){
		console.log(_this)
		_this.props.history.push('/login');
	}
}