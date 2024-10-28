<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <!-- 控制路由的显示与隐藏，每个组件身上都会有@route和$router属性，通过对路由组件的路径进行判断，进行路由显示与隐藏 -->
    <!-- <Footer v-show="$route.path == '/home' || $route.path == '/search'"></Footer> -->
    <!-- 上述这种写法在路由组件多的情况下不适用  采用路由的元信息中meta属性进行配置-->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  mounted(){
    //派发一个action 获取商品列表分类的数据
    //通知vuex发起请求获取数据
    this.$store.dispatch("categorylist");
  }
}
</script>
