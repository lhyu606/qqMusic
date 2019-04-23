import types from './types';

const actions = {
	incrementAsync({ commit, state }) {
		var p = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(999);
			}, 1000);
		});
		p.then(() => {
			commit(types.INCREMENT);
		}).catch(() => {
			console.log('async operation....');
		});
	}
}

export default actions;
