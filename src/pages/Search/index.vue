<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParmas.categoryName">{{ searchParmas.categoryName}}<i @click="removeCategoryName">x</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParmas.keyword">{{ searchParmas.keyword}}<i @click="removeKeyword">x</i></li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchParmas.trademark">{{ searchParmas.trademark.split(":")[1]}}<i @click="removeTrademark">x</i></li>
            <!-- 平台售卖属性的面包屑 -->
            <li class="with-x" v-for="(p,index) in searchParmas.props" :key="index">{{ p.split(":")[1] }}<i @click="removeAttr(index)">x</i></li>
          </ul>
        </div>
        <!-- 引入 selector 组件-->
        <SearchSelector @trademark="receive" @attr="getattr"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{active:isone}">
                  <a href="#" @click="changeOder('1')">综合<span v-show="isone" class="iconfont" :class="{'icon-down':isDesc,'icon-up':isAsc}"></span> </a>
                </li>
                <li :class="{active:istwo}">
                  <a href="#" @click="changeOder('2')">价格<span v-show="istwo" class="iconfont" :class="{'icon-down':isDesc,'icon-up':isAsc}"></span> </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="list in goodList" :key="list.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 采用声明式导航传递参数 在路由跳转中带有参数，因此需要使用动态传递-->
                     <router-link :to="`/detail/${list.id}`"><img v-lazy="list.defaultImg" /></router-link>
                    <!-- <a href="item.html" target="_blank"><img :src="list.defaultImg" /></a> -->
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ list.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{ list.title
                      }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 引入pagination分页器组件 -->
          <!-- <Pagination :searchParmas="searchParmas"/> -->
          <Pagination @upPage="upPage" :pageNo="this.pageNo" :pageSize="this.pageSize" :total="this.total" :continues="5" :totalPages="this.pages"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters,mapState } from 'vuex';
export default {
  name: 'Search',
  data() {
    return {
      //响应式的数组 带给服务器的参数
      searchParmas: {
        //一级分类标签
        "category1Id": "",
        //二级分类标签
        "category2Id": "",
        //三级分类标签
        "category3Id": "",
        //分类的名字
        "categoryName": "",
        //关键字 路由带着关键字传递参数
        "keyword": "",
        //排序，价格的生序或者降序
        "order": "1:desc",
        //起始页，分页器使用的，代表当前是第几页
        "pageNo": 1,
        //表示每一行展示几个数据
        "pageSize": 10,
        //平台售卖属性所带的参数
        "props": [],
        //品牌
        "trademark": ""
      }
    }
  },
  //组件挂载完毕之前，执行一次
  beforeMount() {
    // console.log(this.$route.params)   //结果 获取到了由路由组件传递的categoryName: '菜刀', category3Id: '381'这两个参数
    //在mounted之前，先对data中的searchParmas的数据进行一次刷新
    //在此处就需要写，例如我点击了厨具当中的菜刀，相对应的就需要捞取到菜刀的数据展示在页面，在浏览器路径中也要展示出来，
    //例如我要捞取华为的数据，相同的也需要在页面和浏览器中显示出来  “华为”这个字符串就是keyword关键字
    // Object.assign(this.$route.searchParmas,this.$route.query, this.$route.params)

    // 在 beforeMount 中添加条件判断，确保只在参数存在时进行合并。
    if (this.$route.query && this.$route.params) {
      Object.assign(this.searchParmas, this.$route.query, this.$route.params);
      // console.log(this.searchParmas)
    }
  },
//组件挂载完毕执行一次【仅仅只执行一次】,因此可以将其封装成一个函数，进行多次调用就可以
  mounted() {
    //派发action任务
    this.getSearchDate();
  },
  components: {
    SearchSelector
  },
  computed: {
    //将仓库当中的数据映射为组件身上的数据    使用map进行数据的捞取
    ...mapGetters(['goodList', 'attrsList','trademarkList']),
    ...mapState({
      total:(state) => {
        return state.search.getSerachList.total
      },
      totalPages:(state) => {
        return state.search.getSerachList.totalPages
      }
    }),
    isone(){
      //描述order中是否包含‘1‘
      return this.searchParmas.order.indexOf('1') != -1;
    },
    istwo(){
      return this.searchParmas.order.indexOf('2') != -1;
    },
    isAsc(){
      return this.searchParmas.order.indexOf('asc') != -1;
    },
    isDesc(){
      return this.searchParmas.order.indexOf('desc') != -1;
    }
  },
  methods: {
    //向服务器发起请求获取Search模块数据(根据参数的不同返回不同的数据)
    getSearchDate() {
      this.$store.dispatch('getSerachList', this.searchParmas)
    },
    removeCategoryName(){
      // this.searchParmas.categoryName = '', //数据置空，浪费性能 因此使用undefined
      this.searchParmas.categoryName = undefined,
      this.searchParmas.category1Id = undefined,
      this.searchParmas.category2Id = undefined,
      this.searchParmas.category3Id = undefined
      this.getSearchDate();
      // this.$router.push({name:'search'})  //这种书写方式，直接把路径中的query和params参数全部都删掉了，但是现在就是需要删除谁才删除谁
      //通过对query和params参数值的变化，来判断删除谁
      if (this.$route.params) {
        //如果params参数为真，那么在路由跳转的时候就带有这个参数
        this.$router.push({name:'search',params:this.$route.params})
      }
    },
    removeKeyword(){
      this.searchParmas.keyword = undefined,
      this.getSearchDate();
      //通知兄弟组件Header组件，清除关键字
      console.log("通知兄弟组件Header组件,清除关键字")
      this.$bus.$emit("clear")
      if (this.$route.query) {
        //如果query参数为真，那么在路由跳转的时候就带有这个参数
        this.$router.push({name:'search',query:this.$route.query})
      }
    },
    //品牌的数据传递
    receive(trademark){
      this.searchParmas.trademark = `${trademark.tmId}:${trademark.tmName}`
      this.getSearchDate();
      // console.log('已成功接收来自子组件的数据-------',this.searchParmas.trademark)
      //整理参数发起请求
      // console.log('已成功接收来自子组件的数据',this.trademarks)
    },
    //删除品牌数据
    removeTrademark(){
      this.searchParmas.trademark = undefined;
      this.getSearchDate();
    },
    //品牌属性值的数据传递
    getattr(attr,attrValue){
      console.log('父组件接收的attr',attr,attrValue)
      //接收完数据--整理数据，发起请求
      let props =  `${attr.attrId}:${attrValue}:${attr.attrName}`
      this.searchParmas.props.push(props);
      console.log(props)
      this.getSearchDate();
      // console.log('接收来自子组件的数据',this.searchParmas.props)
    },
    //品牌属性的删除
    removeAttr(index){
      //从props列表中删除属性
      this.searchParmas.props.splice(index,1)
      this.getSearchDate()
      // console.log(index)
    },
    //用户点击‘综合’，‘价格’ 按钮
    changeOder(value){
      //综合默认是降序，当点击的时候变成升序，在点击变成降序，在点击变成升序
      //当点击价格时，默认是降序，在点击时是升序，在点击又变成降序
      //变化的就是order中的值1:desc的变化
      // console.log(value) 1 2
      // let originorder = this.searchParmas.order
      // console.log(originorder)  //2:desc
      let ordervalue = this.searchParmas.order.split(':')[0];
      let ordersort = this.searchParmas.order.split(':')[1];
      let order = '';
      if (value == ordervalue) {  //综合
        //取反
        order = `${ordervalue}:${ordersort=='desc'?'asc':'desc'}`
      }else{ //价格 默认desc
        order =  `${value}:${'desc'}`
      }
      //整理数据，再次发送请求
      this.searchParmas.order = order
      this.getSearchDate();
    },
    upPage(a){
      console.log('父组件接收数据',a)
      this.searchParmas.pageNo = a
      console.log(this.searchParmas.pageNo)
      this.getSearchDate();
    }
  },
  watch:{
    //通过监听路由数据的变化，再次发起请求，进行捞取不同数据
    $route(newvalue,oldvalue){
      //再次发起请求之前整理带给服务器的参数
      Object.assign(this.searchParmas,this.$route.query,this.$route.params);
      this.getSearchDate();  //再次发起ajax请求
      //每一次请求完毕，应该把相应的一二三级ID清空，让其接收下一级的一二三ID
      this.searchParmas.category1Id = undefined,
      this.searchParmas.category2Id = undefined,
      this.searchParmas.category3Id = undefined
      
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                // -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>