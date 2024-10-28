// search 小仓库
import {reqGetSearchInfo} from '@/api'
const  state = {
    // 仓库存储数据的地方
    getSerachList:{}
}
const mutations = {
     //只能通过此方法修改state的唯一手段
     GRTSEARCHLIST(state,getSerachList){
        state.getSerachList = getSerachList;
     }
}
const actions = { //处理action，可以书写自己的业务逻辑，也可以处理异步
    //需要把点击事件的结果存放在这里，让state认识，但是修改state只能通过mutations进行修改
    //params形参，是当用户派发action的时候，第二次参数传递过来的，至少是一个空对象
    async getSerachList({commit},params={}){
        let result = await reqGetSearchInfo(params);
        // console.log(result);
        if (result.code == 200) {
            commit("GRTSEARCHLIST",result.data)
        }
    }
}
const getters = {  //可以理解为计算属性，用于简化仓库数据，让组件获取仓库的数据时更加方便
    //此处的state就是state中的getSerachList
        //品牌中属性的数据
        attrsList(state){
            return state.getSerachList.attrsList || [];
        },
        //平台商品的数据
        goodList(state){
            //[] 表示在没有网络的时候可以返回一个空数组
            return state.getSerachList.goodsList || [];
        },
        //品牌的数据
        trademarkList(state){
            return state.getSerachList.trademarkList || [];
        }
}

//对外暴露小仓库中的属性
export default {
    state,
    mutations,
    actions,
    getters
}