import { reqGetCode, reqRegisterData, reqLoginData, reqGetUserInfo,reqLogoutInfo } from '@/api'
import { userTokeInfo,getToken,removeToken } from '@/utils/token'
//vuex数据三连环
const state = {
    usermessage: {},
    code: '',
    //获取本地存储的token
    token:getToken()
}
const mutations = {
    PHONEDATA(state, code) {
        state.code = code;
    },
    LOGINDATA(state, token) {
        state.token = token;
    },
    USERINFO(state, usermessage) {
        state.usermessage = usermessage;
    },
    //清除用户数据
    CLEARTUSERMES(state){
        //清除三个 用户信息，token 本地存储的token
        state.usermessage = {};
        state.token = '';
        removeToken();
    }
}
const actions = {
    //获取验证码
    async getCode({ commit }, phone) {
        //调用接口获取数据
        let result = await reqGetCode(phone);
        if (result.code == 200) {
            commit("PHONEDATA", result.data);
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    //获取注册信息
    async getRegisterData({ commit }, user) {
        let result = await reqRegisterData(user);
        console.log('注册成功', result)
        if (result.code == 200) {
            //代表注册成功,之后将数据保存到服务器(不需要三连环,因为没有返回数据)，在发起路由跳转
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //登录信息
    async getLoginData({ commit }, data) {
        let result = await reqLoginData(data);
        if (result.code == 200) {
            //登录成功，服务器下发一个token，用来做用户的唯一标识
            commit('LOGINDATA', result.data.token); //结果token = "dbd27373366b4758a0d8799dd98fdff0"
            //进行token的持久化存储
            userTokeInfo(result.data.token); //调用这个函数，持久化存储token
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    //token登录校验
    async getGetUserInfo({ commit }) {
        let result = await reqGetUserInfo();
        if (result.code == 200) {
            commit('USERINFO', result.data);
            return 'ok'
        }
    },
    //退出登录信息
    async getLogoutInfo({commit}){
        let result = await reqLogoutInfo();
        console.log('退出登录的信息',result)
        if (result.code == 200) {
            //清空state中用户相关的信息清空
            commit('CLEARTUSERMES')
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'));
        }
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}