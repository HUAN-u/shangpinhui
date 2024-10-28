/*
注意
    每引入一个模块或者仓库都需要进行使用Vue.use(vuex);
    vuex是一个对象，对象的身上存在一个Store的方法，这个方法是一个构造函数，可以初始化vuex仓库，因此要对外暴露store类的一个使用
    配置完后需要在入口文件中注册一下仓库
*/
// 配置跟vuex的文件
import Vue from 'vue'
import  Vuex from 'vuex'
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import refister from './refister'
import trade from './trade'
Vue.use(Vuex);
//对外暴露store类的一个实例
export default new Vuex.Store({
    modules:{
        home,
        search,
        detail,
        shopcart,
        refister,
        trade
    }
})