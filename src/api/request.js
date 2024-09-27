import Axios from "axios";

const request = Axios.create({
    baseURL: "http://localhost:9090",
    timeout: 300000,
})

request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';

    config.headers['Authorization'] = window.sessionStorage.getItem('token') === null ? null : window.sessionStorage.getItem('token')

    return config
}, error => {
    return Promise.reject(error)
});

request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        // if (typeof res === 'string') {
        //     res = res ? JSON.parse(res) : res
        // }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

const _get = (url, config) => {
    return new Promise((resolve, reject) => {
        request
            .get(url, config)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};

const _post = (url, config) => {
    return new Promise((resolve, reject) => {
        request
            .post(url, config)
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });

    });
};

export default {
    _get,
    _post
};
