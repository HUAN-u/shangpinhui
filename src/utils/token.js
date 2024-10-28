//把token保存到本地存储
export const userTokeInfo=(token)=>{
    return localStorage.setItem('TOCKEN',token)
}
//获取本地持久化数据
export const getToken = ()=> {
    return localStorage.getItem('TOCKEN')
}
//删除本地持久化数据
export const removeToken = ()=> {
    localStorage.removeItem('TOCKEN')
}