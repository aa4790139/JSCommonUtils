//*************************************************************************
//     创建日期:     2021-01-02 08:01:24
//     文件名称:     ByteUtils.js
//     创建作者:     Harry
//     开发版本:     V1.0
//     相关说明:     字节处理工具
//*************************************************************************
class ByteUtils {
    //-------------------------------------------------------------------------
    constructor() {
    }

    //-------------------------------------------------------------------------
    putByte(n, arr) {
        arr.push(n & 0xFF);
    }

    //-------------------------------------------------------------------------
    putShort(n, arr) {
        arr.push(n & 0xFF);
        arr.push(n >>> 8);
    }

    //-------------------------------------------------------------------------
    putLong(n, arr) {
        this.putShort(n & 0xffff, arr);
        this.putShort(n >>> 16, arr);
    }

    //-------------------------------------------------------------------------
    putString(s, arr) {
        let i, len = s.length;
        for (i = 0; i < len; i += 1) {
            this.putByte(s.charCodeAt(i), arr);
        }
    }

    //-------------------------------------------------------------------------
    readByte(arr) {
        return arr.shift();
    }

    //-------------------------------------------------------------------------
    readShort(arr) {
        return arr.shift() | (arr.shift() << 8);
    }

    //-------------------------------------------------------------------------
    readLong(arr) {
        let n1 = this.readShort(arr),
            n2 = this.readShort(arr);

        // JavaScript can't handle bits in the position 32
        // we'll emulate this by removing the left-most bit (if it exists)
        // and add it back in via multiplication, which does work
        if (n2 > 32768) {
            n2 -= 32768;

            return ((n2 << 16) | n1) + 32768 * Math.pow(2, 16);
        }

        return (n2 << 16) | n1;
    }

    //-------------------------------------------------------------------------
    readString(arr) {
        let charArr = [];

        // turn all bytes into chars until the terminating null
        while (arr[0] !== 0) {
            charArr.push(String.fromCharCode(arr.shift()));
        }

        // throw away terminating null
        arr.shift();

        // join all characters into a cohesive string
        return charArr.join('');
    }

    //-------------------------------------------------------------------------
    readString(arr, len) {
        let charArr = [];
        let index = len;
        while (index > 0) {
            charArr.push(arr.shift());
            index -= 1;
        }
        return charArr.join("");
    }

    //-------------------------------------------------------------------------
    readBytes(arr, n) {
        let i, ret = [];
        for (i = 0; i < n; i += 1) {
            ret.push(arr.shift());
        }

        return ret;
    }

    //-------------------------------------------------------------------------
    short2Bytes(n) {
        let ret = [];
        ret.push(n & 0xFF);
        ret.push(n >>> 8);
        return ret;
    }

    //-------------------------------------------------------------------------
    endianChange(arr) {
        return arr.reverse();
    }

    //-------------------------------------------------------------------------
    putBytes(arr, out) {
        arr.forEach(item => {
            out.push(item);
        });
    }

    //-------------------------------------------------------------------------
}


//-------------------------------------------------------------------------
export const byteUtils = new ByteUtils();
