// home 小仓库 相当于home组件上所存在的数据state
const  state = {
    //state的默认类型，根据服务器返回的数据类型进行设置
    categorylist:[],
    bannerList:[],
    floorList:[]
    //     name:[],
    //     keywords:[],
    //     imgUrl:[],
    //     navList:[],
    //     carouselList:[],
    //     recommendList:[],
    //     bigImg:[]
    // }]
}
//mutations: 唯一可以修改state的地方
const mutations = {
    //将接口获取到的数据，放在state上
    CATEGORYLIST(state,categorylist){ //categorylist这个是参数,state是本身存在的
        //需要将result.data的结果添加到state身上
        state.categorylist = categorylist;  //state本身上的categorylist = 服务器返回的数组categtaylist
    },
    BANNERLIST(state,getBannerList){
        state.bannerList = getBannerList;
    },
    FLOORLIST(state,getFloorList){
        state.floorList = getFloorList;
    }
}
import {reqCategoryList,reqGetbannerList,reqFloorList} from '@/api'
//actions: 用户处理派发action地方，可以书写异步语句、逻辑语句的地方(例如条件判断)
const actions = {
    //通过api接口 获取服务器的数据
    //获取 全部商品列表展示的数据
    async categorylist({commit}){
       let result = await reqCategoryList()  //返回的结果是列表
    //    console.log(result)
        if (result.code == 200) {  //如果code=200表示成功，那么需要修改仓库state中的数据   //commit表示解构/提交mutations
            commit("CATEGORYLIST",result.data) //result.data的结果也是一个列表
        }
    },
    //获取 banner轮播图的数据
    async getBannerList({commit}){
        let result = await reqGetbannerList();
        // console.log('data',result)
        if (result.code == 200) {
            commit("BANNERLIST",result.data)
        }
    },
    //获取floor家用电器的数据  commit提交mutation数据
    async getFloorList({commit}){
        let result = await reqFloorList(); //reqFloorList()是api接口的请求
        // console.log('data',result)
        if (result.code == 200) {
            commit("FLOORLIST",result.data)  //表示将data数据提交给mutation
        }
    }
}
//计算属性
const getters = {}

//对外暴露小仓库中的属性
export default {
    state,
    mutations,
    actions,
    getters
}