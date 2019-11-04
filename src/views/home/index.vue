<template>
  <div class="home-container">
    <el-row class="content">
      <img src="@/assets/images/chatu.png" alt="chatu">
      <p>欢迎进入pax-admin平台</p>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.home-container {
  padding-top: 15%;
  .content {
    width: 300px;
    margin: 0 auto;
    img {
      width: 100%;
    }
    p {
      font-size: 16px;
      color: #676767;
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
