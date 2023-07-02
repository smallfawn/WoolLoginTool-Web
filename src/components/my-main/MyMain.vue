<template>
  <div>
    <el-tabs v-model="MainName" type="card" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="公告" name="mainfirst">{{
        this.$store.state.notice
      }}</el-tab-pane>
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
                <el-input size="large" placeholder="手机号" @change="Change_PCode" v-model="this.$store.state.PCode" />
              </el-form-item>
              <el-form-item label>
                <el-input size="large" placeholder="验证码" @change="Change_VCode" v-model="this.$store.state.VCode">
                  <template #append>
                    <el-button @click="getVCode('gqcq', 'appsendcode')"
                      :disabled="this.$store.state.countdown ? true : false">{{
                        this.$store.state.countdown
                        ? `${this.$store.state.countdown}秒后重新获取`
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
                <el-input size="large" placeholder="手机号" @change="Change_PCode" v-model="this.$store.state.PCode" />
              </el-form-item>
              <el-form-item label>
                <el-input size="large" placeholder="验证码" @change="Change_VCode" v-model="this.$store.state.VCode">
                  <template #append>
                    <el-button @click="getVCode('gqcq', 'wxsendcode')"
                      :disabled="this.$store.state.countdown ? true : false">{{
                        this.$store.state.countdown
                        ? `${this.$store.state.countdown}秒后重新获取`
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
                <el-input size="large" placeholder="手机号" @change="Change_PCode" v-model="this.$store.state.PCode" />
              </el-form-item>
              <el-form-item label>
                <el-input size="large" placeholder="验证码" @change="Change_VCode" v-model="this.$store.state.VCode">
                  <template #append>
                    <el-button @click="getVCode('qtx', 'appsendcode')"
                      :disabled="this.$store.state.countdown ? true : false">{{
                        this.$store.state.countdown
                        ? `${this.$store.state.countdown}秒后重新获取`
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
    <el-checkbox :disabled="isUpdateStatus == false" v-model="this.$store.state.isUpdate" label="是否上传服务器" size="large"
      @click="Change_isUpdate(this.$store.state.isUpdate)" />
    <!-- -->
    <el-alert :title="this.$store.state.data" type="success" center effect="dark" />
    <img :src="payQrCode" alt="payQrCode" v-if="this.$store.state.payQrStatus" />
  </div>
  <el-button id="CaptchaId" @click="YiDun">captcha</el-button>
  <div id="captchaYD"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import captcha from "../../assets/captcha";
import QRCode from "qrcode";
import axios from "axios";
import CryptoJS from "crypto-js";
import request from "../../assets/request";
import utils from "../../assets/utils";
import handler from "../../assets/handler";

export default {
  setup(){},

  name: "MyMain",
  data() {
    return {
      selectValue: "",
      activeName: ref("first"),
      MainName: ref("mainfirst"),
      payQrCode: null,
      qrStatus: false,
      list: null,
      isUpdateStatus: false,
      captchaIns: ref(),

    };
  },
  created() {
    /*this.getData("notice");
    this.getData("appList");
    this.getData("upServer");
    this.getPayConfig();*/
  },
  mounted() {
    this.initNECaptcha()

  },
  watch: {
    "$store.state.payUrl": {
      handler(newVal, oldVal) {
        //console.log(newVal, oldVal);
        this.newQRCode(newVal);
      },
    },
  },
  methods: {
    YiDun(){
    console.log(this.captchaIns);
      this.captchaIns && this.captchaIns.verify()
    },
    initNECaptcha() {
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
    },

    Change_isUpdate(data) {
      //console.log(`改变前${this.$store.state.isUpdate}`);
      this.$store.commit("Change_isUpdate", data);
      //console.log(`改变后${this.$store.state.isUpdate}`);
    },
    handleClick() { },
    async getPayConfig() {
      let getPayConfigRes = await request.getPayConfig();
      console.log(getPayConfigRes);
      this.$store.commit("Change_payConfig", getPayConfigRes);
    },
    async getData(type) {
      let getDataRes = await request.getData(type);
      //console.log(type, getDataRes);
      if (type == "appList") {
        this.list = getDataRes;
      } else if (type == "upServer") {
        if (getDataRes == true) {
          this.isUpdateStatus = true;
          this.$store.commit("Change_isUpdate", true);
        } else {
          this.isUpdateStatus = false;
          this.$store.commit("Change_isUpdate", false);
        }
      } else if (type == "notice") {
        console.log(getDataRes);
        this.$store.commit("Change_notice", getDataRes);
      } else {
      }
    },
    async newQRCode(payUrl) {
      QRCode.toDataURL(payUrl, (err, url) => {
        if (err) {
          console.error(err);
          console.log("转换二维码失败");
        } else {
          this.payQrCode = url;
        }
      });
      this.$store.state.payQrStatus = true;
    },
    async getPayOrder() { },
    Change_PCode(PCode) {
      this.$store.commit("Change_PCode", PCode);
      console.log(PCode);
    },
    Change_VCode(VCode) {
      this.$store.commit("Change_VCode", VCode);
      console.log(VCode);
    },
    async getVCode(app, type) {
      await handler.handler_getVCode(app, type);
    },
    async doLogin(app, type) {
      console.log(this.$store.state.isUpdate);
      let doLoginRes = await request.doLogin(app, type);
      console.log(doLoginRes);
      this.$store.commit("Change_data", doLoginRes.data);
    },
  },
};
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