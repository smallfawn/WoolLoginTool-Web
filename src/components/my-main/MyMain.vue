<template>
  <div>
    <el-tabs v-model="MainName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="公告" name="mainfirst">{{baseStore.notice}}</el-tab-pane>
      <el-tab-pane label="wxpusher推送" name="mainsecond">wxpusher</el-tab-pane>
    </el-tabs>
    <el-select v-model="selectValue" class="m-2" placeholder="默认" size="large">
      <el-option v-for="item in list" :key="item.app" :label="item.name" :value="item.app" />
    </el-select>

    <el-tabs v-model="activeName" class="demo-tabs" stretch v-if="selectValue == 'gqcq'">
      <el-tab-pane label="传祺" name="first">
        <el-row>
          <el-col :xs="1" :sm="5" :md="5" :lg="5" :xl="6"></el-col>
          <el-col :xs="20" :sm="14" :md="14" :lg="14" :xl="12">
            <el-form label-width="0px">
              <el-form-item label>
                <el-input size="large" placeholder="手机号" @change="Change_PCode" v-model="baseStore.PCode" />
              </el-form-item>
              <el-form-item label>
                <el-input size="large" placeholder="验证码" @change="Change_VCode" v-model="baseStore.VCode">
                  <template #append>
                    <el-button @click="getVCode('gqcq', 'appsendcode')"
                      :disabled="baseStore.countdown ? true : false">{{
                        baseStore.countdown
                        ? `${baseStore.countdown}秒后重新获取`
                        : "获取验证码"
                      }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-button size="large" type="primary" style="width: 100%" @click="doLogin('gqcq', 'applogin')">
                <span>登录</span>
              </el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="小程序" name="second">
        <el-row>
          <el-col :xs="1" :sm="5" :md="5" :lg="5" :xl="6"></el-col>
          <el-col :xs="20" :sm="14" :md="14" :lg="14" :xl="12">
            <el-form label-width="0px">
              <el-form-item label>
                <el-input size="large" placeholder="手机号" @change="Change_PCode" v-model="baseStore.PCode" />
              </el-form-item>
              <el-form-item label>
                <el-input size="large" placeholder="验证码" @change="Change_VCode" v-model="baseStore.VCode">
                  <template #append>
                    <el-button @click="getVCode('gqcq', 'wxsendcode')"
                      :disabled="baseStore.countdown ? true : false">{{
                        baseStore.countdown
                        ? `${baseStore.countdown}秒后重新获取`
                        : "获取验证码"
                      }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-button size="large" type="primary" style="width: 100%" @click="doLogin('gqcq', 'wxlogin')">
                <span>登录</span>
              </el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="activeName" class="demo-tabs" stretch v-if="selectValue == 'qtx'">
      <el-tab-pane label="青碳行" name="first">
        <el-row>
          <el-col :xs="1" :sm="5" :md="5" :lg="5" :xl="6"></el-col>
          <el-col :xs="20" :sm="14" :md="14" :lg="14" :xl="12">
            <el-form label-width="0px">
              <el-form-item label>
                <el-input size="large" placeholder="手机号" @change="Change_PCode" v-model="baseStore.PCode" />
              </el-form-item>
              <el-form-item label>
                <el-input size="large" placeholder="验证码" @change="Change_VCode" v-model="baseStore.VCode">
                  <template #append>
                    <el-button @click="getVCode('qtx', 'appsendcode')"
                      :disabled="baseStore.countdown ? true : false">{{
                        baseStore.countdown
                        ? `${baseStore.countdown}秒后重新获取`
                        : "获取验证码"
                      }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-button size="large" type="primary" style="width: 100%" @click="doLogin('qtx', 'applogin')">
                <span>登录</span>
              </el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <br />
    <el-checkbox :disabled="isUpdateStatus == false" :model-value="baseStore.isUpdate" label="是否上传服务器" size="large"
      @change="Change_isUpdate(baseStore.isUpdate)" />
    <!-- -->
    <el-alert :title="baseStore.data" type="success" center effect="dark" />
    <img :src="payQrCode" alt="payQrCode" v-if="baseStore.payQrStatus" />
  </div>
  <el-button id="CaptchaId" @click="YiDun">captcha</el-button>
  <div id="captchaYD"></div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import captcha from "../../assets/captcha";
import QRCode from "qrcode";
import axios from "axios";
import CryptoJS from "crypto-js";
import request from "../../assets/request";
import utils from "../../assets/utils";
import handler from "../../assets/handler";
import {useBaseStore} from '@/store/index';

const baseStore = useBaseStore();

const selectValue = ref("");
const activeName = ref("first");
const MainName = ref("mainfirst");
const payQrCode = ref(null);
const qrStatus = ref(false);
const list = ref(null);
const isUpdateStatus = ref(false);
const captchaIns = ref();

watch(
  () => baseStore.payUrl,
  (newVal, oldVal) => {
    newQRCode(newVal);
  }
);

const YiDun = () => {
  console.log(captchaIns.value);
  captchaIns.value && captchaIns.value.verify()
};

const Change_isUpdate = (data) => {
  //console.log(`改变前${this.$store.state.isUpdate}`);
  baseStore.Change_isUpdate(data);
  //console.log(`改变后${this.$store.state.isUpdate}`);
};

const handleClick = () =>  { };

const newQRCode = async (payUrl) => {
  QRCode.toDataURL(payUrl, (err, url) => {
    if (err) {
      console.error(err);
      console.log("转换二维码失败");
    } else {
      payQrCode.value = url;
    }
  });
  baseStore.Change_payQrStatus(true);
};

const getPayOrder = async () => { };
const Change_PCode = (PCode) => {
  baseStore.Change_PCode(PCode);
  console.log(PCode);
};
const Change_VCode = (VCode) => {
  baseStore.Change_VCode(VCode);
  console.log(VCode);
};
const getVCode = async (app, type) => {
  await handler.handler_getVCode(app, type);
};
const doLogin = async (app, type) => {
  console.log(baseStore.isUpdate);
  let doLoginRes = await request.doLogin(app, type);
  console.log(doLoginRes);
  baseStore.Change_data(doLoginRes.data);
};

const getData = async (type) => {
  let getDataRes = await request.getData(type);
  //console.log(type, getDataRes);
  if (type == "appList") {
    list.value = getDataRes;
  } else if (type == "upServer") {
    baseStore.Change_isUpdate(getDataRes == true);
    isUpdateStatus.value = getDataRes == true;
  } else if (type == "notice") {
    console.log(getDataRes);
    baseStore.Change_notice(getDataRes);
  } else {
  }
};

const getPayConfig = async () => {
  let getPayConfigRes = await request.getPayConfig();
  console.log(getPayConfigRes);
  baseStore.Change_payConfig(getPayConfigRes);
};

const initNECaptcha = () => {
  initNECaptchaWithFallback({
    element: '#captchaYD',
    captchaId: 'eda6d7f57cf54b5d8f9b0ed24e5b6e66',
    width: '320px',
    mode: 'popup',
    apiVersion: 2,
    popupStyles: {
      position: 'fixed',
      top: '20%'
    },
    onVerify: (err, data) => {
      if (err) return

    }
  }, (instance) => {
    console.log(instance);
    //this.captchaIns.value = instance
  }, (err) => {
    console.warn(err)
  })
};


onMounted(() => {
  // getData("notice");
  // getData("appList");
  // getData("upServer");
  // getPayConfig();
    initNECaptcha();
});
</script>

<style lang="less" scoped>
// .el-button {
//   //display: flex;
//   //height: var(--el-button-size)
//   padding: 15px 20px;
// }

// .el-button > span {
//   align-items: center;
//   display: inline-flex;
// }
// .flex {
//   display: flex;
// }
</style>