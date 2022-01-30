// let BASE_URL = 'http://192.168.0.192:8080/platform_framework_war_exploded';
let BASE_URL = 'https://shyq.winzkj.com';
// let BASE_URL = 'https://test.winzkj.com';

let API_URL = {
	baseUrl: BASE_URL,

	//登录
	wxLoginUrl: BASE_URL + "/prod-api/driverLogin",
	driverIndex: BASE_URL + "/prod-api/driver/index",
	driverLogout: BASE_URL + "/prod-api/logout",
	sendLoginSmsCode: BASE_URL + "/prod-api/sms/sendLoginSmsCode", //发送登录短信验证码

};

export default API_URL
