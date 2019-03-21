import axios from 'axios'
import vue from 'vue'

axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded'

// 请求拦截器
axios.interceptors.request.use((config) => {
	return config;
}, (error) => {
	return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use((response) => {
	return response;
}, (error) => {
	return Promise.reject(error);
});

// 封装 axios 的 post 请求
export function fetch(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, params)
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				reject(error);
			})
	});
}

export default {
	getFoods(url, params) {
		return fetch(url, params);
	}
}
