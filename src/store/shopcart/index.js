import { reqShopCartsList, reqShopDelete, reqShopCheckCart } from '@/api'
const state = {
    shopcartlist: []
}
const mutations = {
    SHOPCART(state, shopcartlist) {
        state.shopcartlist = shopcartlist;
    }
}
const actions = {
    //发请求获取shopcar组件的数据
    async getShopCartList({ commit }) {
        let result = await reqShopCartsList();
        if (result.code == 200) {
            commit("SHOPCART", result.data)
        }
        //    console.log('shopcart的数据',result) 
        //{code: 200, message: '成功', data: Array(0), ok: true
        //Array(0) 是因为后台无法确定“产品的ID”和“数量”所对应哪一个人，所以需要通过uuid给数据打标签，让后台数据库能识别
    },
    /*删除购物车某一个产品的请求*/
    async getShopDeleteList({ commit }, skuId) {
        let result = await reqShopDelete(skuId);
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //切换商品选中状态
    async getShopCheckCart({ commit }, { skuId, isChecked }) {
        let result = await reqShopCheckCart(skuId, isChecked)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //删除全部勾选的产品
    getdeltetCheckShop({ dispatch, getters }) {
        //context简称小仓库，本身带有getters, state, rootGetters, dispatch, commit参数
        //第一步知道商品的id,id存储在getters和state中
        //第二部获取购物车中的全部商品 是一个数组
        // console.log('getters',getters)
        let PromiseALL = [];//定义一个数组用来存放数组
        getters.shopcartlist.cartInfoList.forEach(item => {
            //调用删除一个商品的函数，执行多次
            if (item.isChecked == 1) {
                let promise = dispatch('getShopDeleteList', item.skuId) //派发action调用getShopDeleteList函数会有一个promise返回值
                //然后将返回的promise追加到PromiseALL数组中
                PromiseALL.push(promise)
            } else {
                return '';
            }
        });
        return Promise.all(PromiseALL);//返回全部的promise都成功，返回结果即为成功｜如果有一个失败则为失败
    },
    //修改全选框的状态
    getShopChoose({ dispatch, getters },isChecked) { //回调函数记得要有返回值
        //获取当前购物车中的产品数据，在通过判断isChecked是0或1进行全选还是不全选
        // 全选框的
        //状态默认是0
        //当状态变成1的时候(需要全选所有商品，我们就需要判断购物车当中的产品是已勾选还是未勾选，对于已勾选的产品返回原状态，对于未勾选的产品修改状态，)
        let PromiseALL = [];
        getters.shopcartlist.cartInfoList.forEach(item => { //获取购物车中的数据
            //调用getShopCheckCart函数，判断当前购物车产品的状态
            let promise = dispatch('getShopCheckCart', { skuId: item.skuId, isChecked:isChecked }) //派发action调用getShopDeleteList函数会有一个promise返回值
            //然后将返回的promise追加到PromiseALL数组中
            PromiseALL.push(promise)
        });
        return Promise.all(PromiseALL)
        // getShopCheckCart()
    }
}
const getters = {
    shopcartlist(state) {
        console.log('state', state)
        return state.shopcartlist[0] || [];
    },
    // cartInfoList(state){
    //     return state.shopcartlist[0].cartInfoList || [];
    // }
}

export default {
    state,
    mutations,
    actions,
    getters,
}