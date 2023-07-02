import VueMain from '../main';
import utils from './utils';
import request from './request';
export default {
    handler_getPayOrder,
    handler_getVCode
}

async function handler_getPayOrder() {
    let getPayConfig = VueMain.store.state.payConfig;  //获取payConfig配置
    if (
        VueMain.store.state.PCode !== null &&  //判断手机号是否为空
        VueMain.store.state.PCode !== undefined
    ) {
        if (getPayConfig.payConfig.status == true) {  //判断pay状态是否为true 
            let getorderRes = await request.getOrder();  //为true则创建订单
            //console.log(getorderRes);
            if (getorderRes.status == true) {  //如果创建订单成功
                //await this.newQRCode(getorderRes.data.payUrl);  //展示二维码
                VueMain.store.commit("Change_payUrl", getorderRes.data.payUrl)
                console.log(VueMain.store.state.payUrl);
                VueMain.store.commit(
                    "Change_data",
                    `请在${getorderRes.data.timeOut}分钟内支付${getorderRes.data.reallyPrice}`
                );//改变输出内容
                for (let i = 0; i < 150; i++) {  //循环检测订单状态
                    await utils.wait(2000);
                    let checkPayOrderRes = await request.checkOrder(
                        getorderRes.data.orderId
                    );
                    //console.log(checkPayOrderResult);
                    if (checkPayOrderRes.status) {  //如果订单支付成功 则返回状态
                        return checkPayOrderRes;
                    }
                }
            } else {
                VueMain.store.commit(
                    "Change_data",
                    `${getorderRes.msg},请联系网站管理员`  //报错
                );
                return getorderRes;
            }
        } else {
            return getPayConfig;
        }
    } else {
        VueMain.store.commit("Change_data", "请输入手机号");
    }
}


async function handler_getVCode(app, type) {
    let getPayConfigRes = VueMain.store.state.payConfig  //获取payConfig配置
    if (getPayConfigRes.payConfig.status == true) {  //如果支付状态开启
        let getorderRes = await handler_getPayOrder();  //支付成功
        if (getorderRes.status == true) {
            let sendcodeRes = await request.getVcode(app, type)
            if (sendcodeRes.status) {
                let i = 60; // 倒计时秒数
                let t = setInterval(() => {
                    VueMain.store.commit("Change_countdown", i)
                    // 60 秒倒计时结束
                    if (i === 0) {
                        clearInterval(t);
                        VueMain.store.commit("Change_countdown", null)
                    }
                    i--;
                }, 1000);
                VueMain.store.commit("Change_payQrStatus", false)
            }
            console.log(sendcodeRes);
        }
    } else if (getPayConfigRes.payConfig.status == false) {
        let sendcodeRes = await request.getVcode(app, type)
        if (sendcodeRes.status == true) {
            let i = 60; // 倒计时秒数
            let t = setInterval(() => {
                VueMain.store.commit("Change_countdown", i)

                // 60 秒倒计时结束
                if (i === 0) {
                    clearInterval(t);
                    VueMain.store.commit("Change_countdown", null)
                }
                i--;
            }, 1000);
            VueMain.store.commit("Change_payQrStatus", false)
        }
        console.log(sendcodeRes);
    }
}