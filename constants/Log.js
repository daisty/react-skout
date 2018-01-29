const logger = true;

export default Log = function () {
    if(logger){
        let newArray = Array.prototype.slice.apply(arguments);
        newArray.unshift('constants/Log.js');
        console.log.apply(console,newArray);
    }
}

