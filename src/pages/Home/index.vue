<template>
    <div>
      <!-- 使用三级联动组件，由于三级联动组件已经被注册成全局组件，因此不需要引用，可以直接使用 -->
       <TypeNav/>
       <ListContainer/>
       <Recommend/>
       <Rank/>
       <Link/>
       <Floor v-for=" floor in floorList" :key="floor.id" :list="floor"/>
       <!-- <Floor/> -->
       <Brand/>
    </div>

</template>

<script>
// 引入其余的组件
import ListContainer from '@/pages/Home/ListContainer';
import Recommend from '@/pages/Home/Recommend';
import Rank from '@/pages/Home/Rank';
import Link from '@/pages/Home/Link';
import Floor from '@/pages/Home/Floor';
import Brand from '@/pages/Home/Brand';
import { mapState } from 'vuex';
export default {
    name: 'home',
    components:{
      ListContainer,
      Recommend,
      Rank,
      Link,
      Floor,
      Brand
    },
    computed:{
      ...mapState({
        //获取列表 返回数据
        floorList:(state) => {
          return state.home.floorList;
      }
      }),
      //通过计算属性获取到用户数据
    },
    mounted() {
    //派发action，获取follr组件数据，通过vuex发起ajax请求，将数据存储在仓库中
      this.$store.dispatch('getFloorList');
      this.$store.dispatch('getGetUserInfo')
    },
  };
</script>

<style scoped>
</style>