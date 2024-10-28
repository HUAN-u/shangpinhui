//引入数据
import Mock from "mockjs";
import banner from './banner.json'
import floor from './floor.json'

//mock数据 参数一：参数请求的地址 参数二：请求的数据
Mock.mock("/mock/banner",{code:200,data:banner})  //轮播图数据
Mock.mock("/mock/floor",{code:200,data:floor}) //家用电器数据