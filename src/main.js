

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createStore } from 'vuex'


// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            PCode: null,
            VCode: null,
            data: '变量',
            isUpdate: false,
            payQrStatus: false,
            countdown: null,
            payConfig: {},
            notice: 'notice',
            payUrl: null,
            payQrCode: null
        }
    },
    mutations: {
        Change_PCode(state, PCode) {
            state.PCode = PCode
        },
        Change_VCode(state, VCode) {
            state.VCode = VCode
        },
        Change_data(state, data) {
            state.data = data
        },
        Change_payConfig(state, data) {
            state.payConfig = data
        },
        Change_payQrStatus(state, data) {
            state.payQrStatus = data
        },
        Change_notice(state, data) {
            state.notice = data
        },
        Change_payUrl(state, data) {
            state.payUrl = data
        },
        Change_isUpdate(state, data) {
            state.isUpdate = data
        },
        Change_countdown(state, data) {
            state.countdown = data
        },
    }
})
export default {
    store
}
const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.mount('#app')
