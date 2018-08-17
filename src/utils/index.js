export default class Utils {
	static logOut(_this){
		sessionStorage.removeItem("beautifulGirl");
		_this.props.history.push('/login');
	}
}