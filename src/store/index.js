import {defineStore} from 'pinia';

export const useBaseStore = defineStore('base-store', {
  state: () => ({
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
  }),
  actions: {
    Change_PCode(PCode) {
        this.PCode = PCode
    },
    Change_VCode(VCode) {
        this.VCode = VCode
    },
    Change_data(data) {
        this.data = data
    },
    Change_payConfig(data) {
        this.payConfig = data
    },
    Change_payQrStatus(data) {
        this.payQrStatus = data
    },
    Change_notice(data) {
        this.notice = data
    },
    Change_payUrl(data) {
        this.payUrl = data
    },
    Change_isUpdate(data) {
        this.isUpdate = data
    },
    Change_countdown(data) {
        this.countdown = data
    },
  }
})