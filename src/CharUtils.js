//*************************************************************************
//     创建日期:     2021-01-02 08:01:16
//     文件名称:     CharUtils.js
//     创建作者:     Harry
//     开发版本:     V1.0
//     相关说明:     字符处理工具
//*************************************************************************
//-------------------------------------------------------------------------
class CharUtils {
    constructor() {
    }

    //-------------------------------------------------------------------------
    stringToUTF8Arr(content) {
        let utf8Bytes = [];
        for (let i = 0; i < content.length; i++) {
            let charcode = content.charCodeAt(i);
            if (charcode < 0x80) utf8Bytes.push(charcode);
            else if (charcode < 0x800) {
                utf8Bytes.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8Bytes.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                    | (content.charCodeAt(i) & 0x3ff));
                utf8Bytes.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8Bytes;
    }

//-------------------------------------------------------------------------
    utf8ArrToString(utf8Arr) {
        let out, i, len, c;
        let char2, char3;

        out = "";
        len = utf8Arr.length;
        i = 0;
        while (i < len) {
            c = utf8Arr[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = utf8Arr[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = utf8Arr[i++];
                    char3 = utf8Arr[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

//-------------------------------------------------------------------------
    fromUTF8Array(data) {
        let str = '', i;
        for (i = 0; i < data.length; i++) {
            let value = data[i];

            if (value < 0x80) {
                str += String.fromCharCode(value);
            } else if (value > 0xBF && value < 0xE0) {
                str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                i += 1;
            } else if (value > 0xDF && value < 0xF0) {
                str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                i += 2;
            } else {
                // surrogate pair
                let charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

                str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                i += 3;
            }
        }

        return str;
    }

//-------------------------------------------------------------------------
    bytesArrToUTF8Arr(byteArray) {
        let uint8Array = new Uint8Array(byteArray.length);
        for (let i = 0; i < uint8Array.length; i++) {
            uint8Array[i] = byteArray[i];
        }
        return uint8Array;
    }

//-------------------------------------------------------------------------
    byteArrToString(byteArr) {
        let content = "";
        for (let i = 0; i < byteArr.length; i++) {
            content += String.fromCharCode(parseInt(byteArr[i]));
        }
        return content;
    }

//-------------------------------------------------------------------------
    stringToByteArr(content) {
        let byteArr = [];
        for (let i = 0; i < content.length; i++) {
            byteArr.push(content.charCodeAt(i));
        }
        return byteArr;
    }

//-------------------------------------------------------------------------
    string2ByteArr(content, splitChar) {
        let byteArr = [];
        let strArr = content.split(splitChar);
        strArr.forEach(item => {
            byteArr.push(parseInt(item));
        });
        return byteArr;
    }

//-------------------------------------------------------------------------
    /**
     * 十六进制字符串转字节数组
     * 每2个字符串转换
     * 903132333435363738 转为 [-112, 49, 50, 51, 52, 53, 54, 55, 56]
     * @param {String} str 符合16进制字符串
     */
    hexStr2Bytes(str) {
        let pos = 0;
        let len = str.length;
        if (len % 2 != 0) {
            return null;
        }
        len /= 2;
        let hexA = new Array();
        for (let i = 0; i < len; i++) {
            let s = str.substr(pos, 2);
            let v = parseInt(s, 16);
            if (v >= 127) v = v - 255 - 1
            hexA.push(v);
            pos += 2;
        }
        return hexA;
    }

//-------------------------------------------------------------------------
    bytes2HexStr(arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
            let tmp;
            let num = arr[i];
            if (num < 0) {
                //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
                tmp = (255 + num + 1).toString(16);
            } else {
                tmp = num.toString(16);
            }
            if (tmp.length == 1) {
                tmp = "0" + tmp;
            }
            str += tmp;
        }
        return str;
    }

//-------------------------------------------------------------------------
    fourByteArr2oneByteArr(arr) {
        let byteArr = [];
        for (let i = 0; i < arr.length; i++) {
            let doubleByte = arr[i];
            byteArr.push(doubleByte >> 24);
            byteArr.push((doubleByte & 0xFF0000) >> 16);
            byteArr.push((doubleByte & 0xFF00) >> 8);
            byteArr.push(doubleByte & 0xFF);
        }
        return byteArr;
    }

//-------------------------------------------------------------------------
    /**
     * 字节数组转十六进制字符串
     * [-112, 49, 50, 51, 52, 53, 54, 55, 56] 转换 903132333435363738
     * @param {Array} arr 符合16进制数组
     */
    byteArr2HexStr(arr) {
        let str = "";
        for (let i = 0; i < arr.length; i++) {
            let tmp;
            let num = arr[i];
            if (num < 0) {
                //此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
                tmp = (255 + num + 1).toString(16);
            } else {
                tmp = num.toString(16);
            }
            if (tmp.length == 1) {
                tmp = "0" + tmp;
            }
            str += tmp;
        }
        return str;
    }

//-------------------------------------------------------------------------
    int8ArrToUint8Arr(arr) {
        let uint8Array = [];
        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i];
            if (temp < 0) {
                uint8Array.push(temp & 0xFF);
            } else {
                uint8Array.push(temp);
            }
        }
        return uint8Array;
    }

//-------------------------------------------------------------------------
    byteArrayToArrayBuffer(arr) {
        let bufferArray = new ArrayBuffer(arr.length)
        let uint8Array = new Uint8Array(bufferArray);
        for (let i = 0; i < arr.length; i++) {
            uint8Array[i] = arr[i];
        }

        return bufferArray;
    }

//-------------------------------------------------------------------------
}

export const charUtils = new CharUtils();

