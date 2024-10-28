//交易仓库数据
import {reqGetTradeInfo,reqUserAddress} from '@/api'
const state = {
    useraddress:[],
    gettradelist:{}
}
const mutations = {
    TRADEDATA(state,gettradelist){
        state.gettradelist = gettradelist;
    },
    USERADDRESS(state,useraddress){
        state.useraddress = useraddress;
    }
}
const actions = {
    //发起请求获取交易的数据
    async getTradeInfo({commit}){
        let result = await reqGetTradeInfo();
        if (result.code == 200) {
            commit('TRADEDATA',result.data);
            return 'ok';
        } else {
            return Promise.reject(new Error('faile'));
        }
    },
    async getUserAddress({commit}){
        let result = await reqUserAddress();
        if (result.code == 200) {
           commit("USERADDRESS",result.data) 
        } else {
            
        }
    }
}
const getters = {
    detailArrayList(state){
        return state.gettradelist.detailArrayList || [];
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}