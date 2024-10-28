//此文件更仓库中的数据进行互动
//在发起请求的时候，将这个uuid通过请求头的方式传递到数据库中，这样，就给所有买的产品打上了标签，


/*封装一个uuidData()函数
要求：uuid必须是唯一的，只能生成一次，否则会打乱产品的识别
函数封装的格式:函数名 = () => {}
*/
import {v4 as uuidv4} from 'uuid';
export const getUUID = () => {
    //将生成的uuid和浏览器中保存的uuid进行对比，不存在则生成，否则相反
    //本地存储:会永久性存储  会话存储:不是永久性存储
    //在此我们采用本地存储
    let uuid_token = localStorage.getItem('UUIDTOKEN'); //将获取到的uuid_token赋值给UUID
    //判断uuid是否存在
    if(!uuid_token){
        //不存在则生成
        uuid_token = uuidv4();
        //生成完之后存储在本地存储中
        localStorage.setItem("UUIDTOKEN",uuid_token)
    }
    //封装函数必须有返回值
    //现在没有存储，因此UUIDTOKEN的结果是undefined
    return uuid_token;
}