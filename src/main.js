import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from './router' // 引入自定义路由配置
Vue.config.productionTip = false
// // 引入接口文件，进行测试
// import {reqGetSearchInfo} from '@/api'
// console.log(reqGetSearchInfo({}));
//引入state仓库
import store from '@/store'
//引入swiper样式
import "swiper/css/swiper.css"
//引入表单校验插件，不需要对外暴露可以向如下方式引入
import "@/plugins/validate"
//注册三级联动，全局组件
//引入TypeNav组件 Carsousel组件
import TypeNav from '@/components/TypeNav'
import Carsousel from '@/components/Carsousel'
import Pagination from './components/Pagination'
import '@/mock/mockServe'
import VueRouter from 'vue-router'
import { Button, MessageBox } from 'element-ui';
import VueLazyload from 'vue-lazyload'
import atm from '@/assets/images/1.jpg'
// 保存原始的 push 方法
let originalPush = VueRouter.prototype.push;

// 重写 push 方法
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    // 如果有成功或失败回调，直接调用原始 push 方法
    // call | apply 区别
    //相同点：都可以调用函数一次，都可以篡改上下文一次
    //不同点：call与apply传递参数，call传递参数用逗号隔开，apply方法执行，传递数组
    return originalPush.call(this, location, onResolve, onReject);
  }
  // 捕获错误，避免重复导航的警告
  return originalPush.call(this, location).catch(err => {
    if (VueRouter.isNavigationFailure(err, VueRouter.NavigationFailureType.duplicated)) {
      // 忽略重复导航的错误
      return err;
    }
    // 如果是其他错误，则继续抛出
    return Promise.reject(err);
  });
};
// 保存原始的 replace 方法
const originalReplace = VueRouter.prototype.replace;

// 重写 replace 方法
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch(err => {
    if (VueRouter.isNavigationFailure(err, VueRouter.NavigationFailureType.duplicated)) {
      return err;
    }
    return Promise.reject(err);
  });
};

//注册全局组件使用component()
//第一个参数：全局组件的名字，第二个参数：使用的那一个组件
Vue.component(TypeNav.name,TypeNav)
Vue.component(Carsousel.name,Carsousel)
Vue.component(Pagination.name,Pagination)
Vue.component(Button.name,Button)
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// const app = createApp(App)
// app.use(router)
// app.$mount('#app')
Vue.use(VueLazyload, {
  loading: atm,
})
//统一接口api文件夹里面的全部请求函数
import * as API  from '@/api'
new Vue({
  render: h => h(App),
  //注册路由 当这里写router的时候，组件的身上就会出现$route和$router
  router,
  //注册仓库：组件实例的身上会多一个$store属性
  store,
  //beforeCreate 模版未解析，且this是vm
  beforeCreate(){
    Vue.prototype.$bus = this;  //安装全局事件总线
    Vue.prototype.$API = API;  //在原型对象身上绑定一个API,后续可以在所有组件中直接使用其身上的属性(属性指的也就是我们所写的接口)
  }
}).$mount('#app')
