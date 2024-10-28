<template>
    <div class="pagination">
        <button :disabled="this.pageNo == 1" @click="$emit('upPage',pageNo-1)">上一页</button>
        <button v-if="startendnumber.start > 1" @click="$emit('upPage',1)" :class="{active:pageNo == 1}">1</button>  <!-- 起始数字大于1的情况下，展示1-->
        <button v-if="startendnumber.start> 2">···</button> <!-- 起始数字大于2的情况下，展示...-->

        <button v-if="page >= startendnumber.start" v-for="(page,index) in startendnumber.end" :key="index" @click="$emit('upPage',page)" :class="{active:pageNo == page}">{{ page }}</button>

        <button v-if="startendnumber.end < this.totalPages - 1">···</button>
        <button v-if="startendnumber.end < this.totalPages" @click="$emit('upPage',totalPages)" :class="{active:pageNo == totalPages}">{{ totalPages }}</button>
        <button :disabled="this.pageNo == totalPages" @click="$emit('upPage',pageNo+1)">下一页</button>
        <button style="margin-left: 30px">共 {{ total }} 条</button>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: ['pageNo', 'pageSize', 'total', 'continues','totalPages'],
    // props:['searchParmas'],
    computed: {
        //总共多少页
        // totalpage() {
        //     return Math.ceil(this.total / this.pageSize);
        // },
        //计算连续的页码的起始页数字和结束页数字【连续页码最低是5】
        startendnumber() {
            //定义两个连量代表起始和结束
            let start = 0, end = 0
            //考虑1 总页数小于连续页时
            if (this.totalPages < this.continues) {  //数据较少，不正常判断
                start = 1  //起始=1
                end = this.totalPages //结束=总页数
            } else {  //正常判断  总页数大于连续页   8 > 5
                //起始页大于连续页时
                if (this.pageNo <= parseInt(this.continues / 2)) { //当前页 小于等于 连续数字
                    start = 1
                    end = this.continues
                } else {  
                    //当前页 大于 连续数字
                    if (this.continues % 2 != 0) {  //奇数
                        start = this.pageNo - parseInt(this.continues / 2)  //起始值 = 当前值 - 分页值/2
                        end = this.pageNo + parseInt(this.continues / 2)   //结束值 = 当前值 + 分页值/2
                        //起始值 到 总页数 之间的数字小于 分页值
                        if (this.pageNo >= (this.totalPages - parseInt(this.continues / 2))) {  // 27 28 29 30 31 从29开始
                            start = this.totalPages - (this.continues - 1)
                            end = this.totalPages
                        }
                    }
                    if(this.continues % 2 == 0){  //偶数 this.continues / 2 == 0
                        console.log('我是偶数，走==0')
                        start = this.pageNo - 2 //起始值 = 当前值 - 2
                        console.log(start)
                        end = this.pageNo + parseInt(this.continues / 2)   //结束值 = 当前值 + 分页值/2
                        //起始值 到 总页数 之间的数字小于 分页值
                        if (this.pageNo >= (this.totalPages - parseInt(this.continues / 2))) {  // 26 27 28 29 30 31 从28开始
                            start = this.totalPages - (this.continues - 1)
                            end = this.totalPages
                        }
                    }
                }
            }
            return { start, end }
        }
    }
};
</script>

<style lang="less" scoped>
.pagination {
    text-align: center;

    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: #606266;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #409eff;
            color: #fff;
        }
    }
}
.active{
    background-color: skyblue;
}
</style>