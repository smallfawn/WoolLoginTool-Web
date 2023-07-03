import axios from "axios";
import utils from "./utils";
import handler from "./handler";
import {useBaseStore} from '@/store/index';

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
    const baseStore = useBaseStore();
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
                mobile: baseStore.PCode,
            }))
        },
        data: JSON.stringify({
            mobile: baseStore.PCode,
        }),
    }
    let { data: sendcodeRes } = await axios.request(options)
    console.log(app, type, baseStore.PCode);
    return sendcodeRes
}
async function doLogin(app, type) {
    const baseStore = useBaseStore();
    let options = {
        method: "POST",
        url: "/api/login/index.php",
        params: {
            app: app,
            type: type,
            isUp: baseStore.isUpdate,
        },
        headers: {
            'timestamp': Date.now(),
            'Content-Type': "applocation/json",
            'x': utils.Jm(utils.CP({
                mobile: baseStore.PCode,
                code: baseStore.VCode
            }))
        },
        data: JSON.stringify({
            mobile: baseStore.PCode,
            code: baseStore.VCode
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
    const baseStore = useBaseStore();
    let getPayConfig = baseStore.payConfig
    let { data: getorderRes } = await axios.get("./api/pay/getorder/index.php", {
        params: {
            payId: "wlp" + Date.now(),
            param: baseStore.PCode,
            type: getPayConfig.payConfig.payType,
            price: getPayConfig.payConfig.getPrice,
            sign: utils.md5_encrypt(
                `${"wlp" + Date.now()}${baseStore.PCode}${getPayConfig.payConfig.payType
                }${getPayConfig.payConfig.getPrice}${getPayConfig.payConfig.key
                }`
            ).toString(),
        },
    });
    return getorderRes
}
