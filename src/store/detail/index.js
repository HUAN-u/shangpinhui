// vuex三连环 actions mutations state
import { reqGoodInfo,reqAddorUpdate } from "@/api";
//封装临时身份的游客
import { getUUID } from "@/utils/uuid_token";
//存放数据的仓库
const state = {
    goodInfo:{},
    uuid_token:getUUID()
}
// 唯一可以修改state仓库的数据
const mutations = {
    GOODLIST(state,goodInfo){
        state.goodInfo = goodInfo;
    }
}
// 用户书写派发action的地方，例如 异步语句、逻辑语句-条件判断
const actions = {
    //通过api接口 获取数据
    async getGoodInfo({commit},skuId){  //在获取数据的时候需要将产品的id带过去
        let result = await reqGoodInfo(skuId);
        if(result.code == 200){  //如果成功发起请求，则向mutations提交返回来的数据
            commit("GOODLIST",result.data)
        } 
    },
    //将用户选择的产品添加到购物车当中 async的返回结果是pramise
    async addorUpdateShopCart({commit},{skuId,skuNum}){
        //使用封装好的api函数，发起请求，获取数据
        //服务器写入数据成功，并没有返回其他数据，只返回了code==200 代表这次操作成功
        //因为数据库没有返回数据，所以我们不需要三连环存储数据
      let result =  await reqAddorUpdate(skuId,skuNum)
      if(result.code == 200){  //点击购物车，情况1:请求发起成功 情况2:请求失败
        //返回成功的标记
        return 'ok'
      }else{
        //失败的标记
        return Promise.reject(new Error('faile'))
      }
    }
}
const getters = {
    //这个里面更加详细的写出了，state本身中每个数据的情况(空或者null)
    categoryView(state){
        //将categoryView数据返回
        return state.goodInfo.categoryView || {};
    },
    skuInfo(state){
        return state.goodInfo.skuInfo || {};
    },
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || [];
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}