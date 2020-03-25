/**
 * Created by shiyonggao on 2019/11/28.
 */
const simplePinyin =  require('simple-pinyin');

class Pinyin {
    /***
     * 获取首字母
     * @param str
     * @returns string
     */
    fristChar(str) {
        let reg = /[\u4e00-\u9fa5]/;
        /**英文字母返回所有字符**/
        if(!reg.test(str)) {
            return str;
        }

        let arr = simplePinyin(str, {pinyinOnly: false});
        let temp = [],
            len = arr.length;
        for(let i = 0; i < len; i++){
            temp.push(arr[i].slice(0,1));
        }
        return temp.join('');
    }

    /**
     * 获取全拼拼音
     * @param str
     */
    fullChar(str){
        return simplePinyin(str, {pinyinOnly: false}).join('');
    }

    /**
     * 获取首字母和全拼
     * @param str
     */
    all(str){
        return {
            frist: this.fristChar(str),
            full: this.fullChar(str)
        };
    }

}

module.exports = new Pinyin();
