import axios from "axios";
import VueMain from '../main'
import utils from "./utils";
import handler from "./handler";

export default {
    getTopTip,
    doLogin,
    getData,
    getPayConfig,
    checkOrder,
    getOrder,
    getVcode
}
async function getData(type) {
    let { data: res } = await axios.get("./api/get/index.php", {
        params: { type: type },
    });
    if (type == "appList") {
        return res;
    } else if (type == "upServer") {
        if (res.upServerStatus == true) {
            return true;
        } else if (res.upServerStatus == false) {
            return false;
        }
    } else if (type == "notice") {
        return res
    } else {
        return res
    }
}
async function getTopTip() {
    let { data: getRes } = await axios("./api/get/index.php", {
        params: {
            type: "tips",
        },
    });
    return getRes
}
async function getVcode(app, type) {
    let options = {
        method: "POST",
        url: "/api/sendcode/index.php",
        params: {
            app: app,
            type: type,
        },
        headers: {
            'timestamp': Date.now(),
            'Content-Type': "applocation/json",
            'x': utils.Jm(utils.CP({
                mobile: VueMain.store.state.PCode,
            }))
        },
        data: JSON.stringify({
            mobile: VueMain.store.state.PCode,
        }),
    }
    let { data: sendcodeRes } = await axios.request(options)
    console.log(app, type, VueMain.store.state.PCode);
    return sendcodeRes
}
async function doLogin(app, type) {
    let options = {
        method: "POST",
        url: "/api/login/index.php",
        params: {
            app: app,
            type: type,
            isUp: VueMain.store.state.isUpdate,
        },
        headers: {
            'timestamp': Date.now(),
            'Content-Type': "applocation/json",
            'x': utils.Jm(utils.CP({
                mobile: VueMain.store.state.PCode,
                code: VueMain.store.state.VCode
            }))
        },
        data: JSON.stringify({
            mobile: VueMain.store.state.PCode,
            code: VueMain.store.state.VCode
        }),
    }
    let { data: doLoginRes } = await axios.request(options)
    console.log(doLoginRes);
    return doLoginRes
}

async function getPayConfig() {
    let { data: getPayConfigResult } = await axios.get("./api/get/index.php", {
        params: {
            type: "pay",
        },
    });
    return getPayConfigResult
}
async function checkOrder(orderId) {
    let { data: checkorderRes } = await axios.get("./api/pay/checkorder/index.php", {
        params: {
            orderId: orderId,
        },
    });
    return checkorderRes;
}

async function getOrder() {
    let getPayConfig = VueMain.store.state.payConfig
    let { data: getorderRes } = await axios.get("./api/pay/getorder/index.php", {
        params: {
            payId: "wlp" + Date.now(),
            param: VueMain.store.state.PCode,
            type: getPayConfig.payConfig.payType,
            price: getPayConfig.payConfig.getPrice,
            sign: utils.md5_encrypt(
                `${"wlp" + Date.now()}${VueMain.store.state.PCode}${getPayConfig.payConfig.payType
                }${getPayConfig.payConfig.getPrice}${getPayConfig.payConfig.key
                }`
            ).toString(),
        },
    });
    return getorderRes
}
