import {parseString} from 'react-native-xml2js';
//config {createNewKey:false}
Array.prototype.updateAttr = function (key, value, newKey, newValue, config) {
    let isFind = 0;
    for (let i = 0, len = this.length; i < len; i++) {
        let t = this[i],
            isKeyAttr = false,
            lastObj = null,
            keyArr = key.split('.');
        keyArr.forEach(function (_key) {
            if ((typeof t[_key]) === 'object') {
                t = t[_key];
            } else {
                isKeyAttr = (_key in t);
                lastObj = t[_key];
            }
        });
        if (!isKeyAttr) {
            throw Error(key + ' 原key找不到');
        }
        if (lastObj !== value) {
            continue;
        }
        let b = this[i],
            isNKeyAttr = false,
            lastNObj = null,
            newKeyArr = newKey.split('.');
        newKeyArr.forEach(function (_nKey) {
            if ((typeof b[_nKey]) === 'object') {
                b = b[_nKey];
            } else {
                isNKeyAttr = (_nKey in b);
                lastNObj = _nKey;
            }
        });
        if (!isNKeyAttr) {
            if (!config || (config && (config.createNewKey && config.createNewKey===false ))) {
                throw Error(newKey + ' 新key找不到');
            }
        }
        b[lastNObj] = newValue;
        isFind++;
    }
    return isFind;
};
String.prototype.symbolReturnClear = function (replaceSymbol) {
    return this.replace(/[\r\n]/g, replaceSymbol || " ");
};
String.prototype.format = function(opts) {//use 'my name is ${name}'.format({name:'lake'})
    var data = Array.prototype.slice.call(arguments, 0),
        toString = Object.prototype.toString;
    if (data.length) {
        data = data.length == 1 ?
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) : data;
        return this.replace(/\$\{(.+?)\}/g, function(match, key) {
            var replacer = data[key];
            // chrome 下 typeof /a/ == 'function'

            if ('[object Function]' == toString.call(replacer)) {
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    return this;
}
String.prototype.xml2js = function (calback) {
    parseString(this,function (err,result) {
        if(err){
            throw new Error(err);
        }
       return calback(result);
    });
};
String.prototype.emojiReplace = function () {
    if(this){
        return this.replace(/\(Y\)/g, "👍")
            .replace(/\*inlove\*/g, "😍")
            .replace(/:\$/g, "☺️")
            .replace(/\*blowkiss\*/g, "😘")
            .replace(/\*unamused\*/g, "😁")
            .replace(/:@/g, "😡")
            .replace(/:\*/g, "😚");
    }
    return ""

}