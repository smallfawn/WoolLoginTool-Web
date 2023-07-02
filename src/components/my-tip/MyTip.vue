<template>
  <div></div>
</template>

<script>
import { ElMessage } from "element-plus";
import { ElNotification } from "element-plus";
import request from "../../assets/request.js";

export default {
  name: "MyTip",
  methods: {
    async getTopTip() {
      let getRes = await request.getTopTip();
      console.log(getRes);
      ElMessage({
        showClose: true,
        message: getRes.topTips,
        type: "success",
      });
      ElNotification({
        title: "Title",
        message: getRes.UpperRight,
      });
    },
  },
  created() {
    //this.getTopTip();
  },
};
</script>

<style lang="less" scoped>
</style>