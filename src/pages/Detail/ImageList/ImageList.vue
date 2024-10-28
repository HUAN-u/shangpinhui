<template>
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(image,index) in skuImageList" :key="image.id">
        <img :src="image.imgUrl" @click="chageImgeValue(index)" :class="{active:chageIndex == index}">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>

  import Swiper from 'swiper'
  export default {
    name: "ImageList",
    data() {
      return {
        chageIndex:0
      }
    },
    props:["skuImageList"],
    watch: {
      skuImageList(newvalue, oldvalue) {
        //handler方法的执行，表示组件实例身上这个属性的属性值已经有了【数组：四个元素】
        //如果只使用这个方法，只判断了bannerList的值是否变化，而v-for没办法保证已经执行完毕
        //因此使用nextTick
        //nextTick: 在下次DOM更新 循环结束后 执行延迟回调，（在修改数据之后，立即使用这个方法，获取更新后的DOM元素）
        this.$nextTick(() => {
          //nextTick 确保页面的结构已经有了，在执行某一件事
          //当执行这个回调函数的时候，v-for的结构数据已经加载完毕，因此就可以new swiper实例
            new Swiper(this.$refs.mySwiper, {
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            //显示几个图片
            slidesPerView:3,
            //每一次切换几个图片个数
            slidesPerGroup:1
          });
        });
      },
    },
    //chageImgeValue是一个小图片的列表，需要index索引进行取值
    methods:{
      chageImgeValue(index){
        //获取到轮播图列表的下标,接下来就是点击哪个图，就给哪个图显示高亮(:class={action:""})
        this.chageIndex = index
        //通知兄弟组件获取当前的索引值
        this.$bus.$emit('getIndex',this.chageIndex)
      }
    }
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>