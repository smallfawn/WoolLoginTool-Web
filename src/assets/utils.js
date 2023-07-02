import CryptoJS from "crypto-js";
export default {
    md5_encrypt,
    wait,

}
function md5_encrypt(data) {
    return CryptoJS.MD5(data)
}
function wait(t) {
    return new Promise((e) => setTimeout(e, t));
}
