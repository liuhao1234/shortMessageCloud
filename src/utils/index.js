export default class Utils {
	static logOut(){
		sessionStorage.removeItem("beautifulGirl");
		window.location.reload();
	}
}