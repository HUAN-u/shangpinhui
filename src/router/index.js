//配置路由的地方
//引入VueRouter
import vue from 'vue'
import VueRouter from 'vue-router'
//使用VueRouter插件
vue.use(VueRouter)
import routes from './routes'
//暴露并配置路由
let router = new VueRouter({
  //配置路由 routes配置项进行路由的配置[]里面配置多个要跳转的路由
  // mode:'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  },
})

//引入store模块
import store from '@/store'
//在路由文件中配置全局守卫-前置守卫(在路由跳转之前进行判断)
// router.beforeEach(async (to, from, next) => {
//   //to 表示跳到哪个路由
//   //from 表示从哪个路由来
//   //next 表示方放行。有三种写法：next();表示全部放行 next(path);表示放行到哪个路由中 next(false);当路由发生变化时，阻止路由发生变化，充值到原来的路由

//   //如何判断是否已经登录，token存在则表示已经登录，不存在则表示没有登录
//   //捞取token。在此文件中可以捞取另一个模块中的数据
//   let token = store.state.refister.token;
//   let name = store.state.refister.name;
//   if (token) {
//     if (to.path == '/login') {
//       next('/home');  //如果用户登录之后还想去login页面,不能去，直接路由跳到首页
//     } else { //用户登录之后不去login，例如去往 search shopcart refister这些页面，也是需要进行判断的满足一定的条件才可以去
//       //条件1 在去往searh搜索页的时候,需要知道用户的信息，否则无法去，
//       if (name) {
//         //存在跳转
//         next();
//       } else {
//         //不存在，发请求获取用户信息,获取成功-发请求 获取失败-清除token，去login页面重新登录
//         //获取用户信息
//         try {
//           await store.dispatch('getGetUserInfo');
//           next();
//         } catch (error) {
//           //条件2 如果用户的信息过期，需要重新发起请求获取用户信息，在进行跳转
//           await store.dispatch('getLogoutInfo');
//           next('/login');
//         }
//       }
//     }
//   } else {
//     //未登录，不能去交易相关的页面
//     //如果去home search等跟交易不相关的页面，放行
//     let topath = to.path; //to.path 去往哪个路径
//     if (topath.indexOf('/trade')!=-1 || topath.indexOf('/pay')!=-1 || topath.indexOf('/center')!=-1) {
//        //此句的意思是：如果你要去往if语句里面的这几个路径中，在为登录的情况下，你直接就会跳转到login页面，
//        //但是现在使用query参数进行重定向redirect到你要去往的路径，并存储于地址栏当中【路由】
//        next('/login?redirect='+topath);
//     } else {
//        next();
//     }
//   }
// });
export default router;

