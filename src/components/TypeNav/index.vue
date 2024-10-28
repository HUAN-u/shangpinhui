<template>
  <!-- 此页面是三级联动的页面 -->
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="loveIndex" @mouseenter="enterShow">
        <!-- 这里使用的事件的委派｜委托，将事件委派给父元素。-->
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 + 过渡动画(存在v-show或v-if指令的标签才能使用过渡动画-使用时需要在外围添加<transition></transition>标签)-->
        <transition class="v">
          <div class="sort" v-show="show">
            <!-- 利用事件委派+编程式导航实现路由的跳转与传递参数 -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级分类 -->
              <div
                class="item"
                v-for="(c1, index) in categorylist"
                :key="c1.categoryId"
                :class="{ cul: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <!-- <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId" >{{ c1.categoryName }}</a> -->
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二级分类 -->
                <div class="item-list clearfix">
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <!-- <a href="" :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId" >{{c2.categoryName}}</a> -->
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <!-- 三级分类 -->
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <!-- <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId"  href="">{{ c3.categoryName }}</a> -->
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
//将获取到的数据进行展示
//使用vuex自带的辅助工具进行测试
import { mapState } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      //在这里定义一个数据，用来判断鼠标移动到那个index索引值上
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕需要向服务器发起请求，获取数据，进行替换和展示
  mounted() {
    if (this.$route.path != "/home") {
      //使用路由路径的判断，对全部商品类型进行展示或隐藏
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      categorylist: (state) => {
        return state.home.categorylist;
      },
    }),
  },
  methods: {
    changeIndex: throttle(function (index) {
      //采用节流的方式,按需引入
      this.currentIndex = index; //index就是将鼠标放在那一个一级分类上获取到的数字
    }, 50),
    //goSearch方法,用来实现路由的跳转
    goSearch(event) {
      //获取需要跳转的路由名称和对应的参数
      let result = event.target; //获取到当前事件的节点  <a data-v-18b3c0cc="" data-categoryname="图书、音像、电子书刊">图书、音像、电子书刊</a>
      // console.log('result',result.dataset) //将这个返回的对象解构出来   DOMStringMap {v-18b3c0cc: '', categoryname: '手机'}
      let { categoryname, category1id, category2id, category3id } =
        result.dataset; //dataset属性，可以获取节点的自定义属性与属性值
      if (categoryname) {
        //需要跳转的路由
        let location = { name: "search" };
        //所带的参数有两个categoryName,categoryId
        let query = { categoryName: categoryname };
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        //添加query参数
        location.query = query;
        //添加params参数
        if (this.$route.params) {
          location.params = this.$route.params;
        }
        this.$router.push(location);
        console.log(location);
      }
    },
    enterShow() {
      //鼠标移入事件
      if (this.$route.path != "/home") {
        //使用路由路径的判断，对全部商品类型进行展示或隐藏
        this.show = true;
      }
    },
    loveIndex() {
      // 鼠标移出
      //事件回调，当鼠标放在h2全部商品分类时，index下标指向0这个索引，也就是c1数组里面的第0个元素，
      if (this.$route.path == "/home") {
        this.currentIndex = -1;
      } else {
        this.show = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
        .cul {
          background: skyblue;
        }
      }
    }
    //过渡动画的开始
    .v-enter{
      height: 0px;
    }
     //过渡动画的结束
    .v-enter-to{
      height: 461px;

    }
     //过渡动画的时间、速率限制
    .v-enter-active{
      transition: all .5s linear;
     }
  }
}
</style>