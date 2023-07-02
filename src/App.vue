<template>
  <div class="app">
    <my-header></my-header>
    <my-main style="margin-top: 20px"></my-main>
    <my-tip></my-tip>
  </div>
</template>

<script>
import MyMain from "./components/my-main/MyMain.vue";
import MyHeader from "./components/my-header/MyHeader.vue";
import axios from "axios";
import MyTip from "./components/my-tip/MyTip.vue";

export default {
  name: "MyApp",
  created() {
    console.log("网站运行ing");
    console.log();
  },
  components: {
    MyMain,
    MyHeader,
    MyTip,
  },
};
</script>
  
<style lang="less" scoped>
.app {
  justify-content: center;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  //place-items: center;
  //align-items: center;
  text-align: center;
}
</style>