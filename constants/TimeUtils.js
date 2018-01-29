export default function (lastTime) {
    let mis = new Date().getTime()-lastTime;
    let date1= lastTime;  //开始时间
    let date2 = new Date();//结束时间
    let date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数
    //计算出相差天数
    let days=Math.floor(date3/(24*3600*1000))
    //计算出小时数
    let leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    let hours=Math.floor(leave1/(3600*1000))
    //计算相差分钟数
    let leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    let minutes=Math.floor(leave2/(60*1000))
    //计算相差秒数
    let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    let seconds=Math.round(leave3/1000)
    if(days > 0){
        return days+'d';
    }else if(hours > 0){
        return hours+'h';
    }else if(minutes > 0){
        return minutes+'m';
    }else if(seconds > 0){
        return seconds+'s';
    }else{
        return 'L';
    }
}