import axios from '../lib/axios-init'

const LOGIN_URL = '/login/cellphone'
const REGISTER_URL = '/register/cellphone'
const CAPTCHA_URL = '/captcha/sent'

//登录
function api_login(params) {
    return axios.get(LOGIN_URL, { params })
}

//注册
function api_register(params) {
    return axios.get(REGISTER_URL, { params })
}

//获取验证码
function api_getCaptcha(params){
    return axios.get(CAPTCHA_URL,{params})
}

export {
    api_login,
    api_register,
    api_getCaptcha
}