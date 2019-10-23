<template>
  <el-dropdown class="notice-container right-menu-item hover-effect" trigger="click">
    <el-badge :value="12" :hidden="false">
      <svg-icon icon-class="bell" />
    </el-badge>
    <el-dropdown-menu slot="dropdown">
      <el-tabs class="notice-tabs" v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="通知 (1)" name="notice">
          <el-dropdown-item>
            <el-row>
              <el-col :span="4">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="">
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">你收到了14份新周报</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><p class="text-small">2 天前</p></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item class="notice-read">
            <el-row>
              <el-col :span="4">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="">
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">你收到了14份新周报</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><p class="text-small">2 天前</p></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row>
              <el-col :span="4">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="">
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">你收到了14份新周报</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><p class="text-small">2 天前</p></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row>
              <el-col :span="4">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="">
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">你收到了14份新周报</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><p class="text-small">2 天前</p></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-dropdown-item>
        </el-tab-pane>
        <el-tab-pane label="消息 (4)" name="message">
          <el-dropdown-item>
            <el-row>
              <el-col :span="4">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg" alt="">
              </el-col>
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">彭海浪回复了你</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <p class="text-small">这种模板用于提醒谁与谁发生了互动，左侧放'谁'的头像。</p>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><p class="text-small">2 天前</p></el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-dropdown-item>
        </el-tab-pane>
        <el-tab-pane label="代办 (2)" name="todo">
          <el-dropdown-item>
            <el-row>
              <el-col :span="18">
                <el-row>
                  <el-col :span="24">
                    <p>任务名称</p>
                  </el-col>
                  <el-col :span="24">
                    <p class="text-small">任务需要在 2019-10-20 前启动</p>
                  </el-col>
                </el-row>
              </el-col>
              <el-row :span="6"><el-tag type="info">未开始</el-tag></el-row>
            </el-row>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-row>
              <el-col :span="18">
                <el-row>
                  <el-col :span="24">
                    <p>CMS变更</p>
                  </el-col>
                  <el-col :span="24">
                    <p class="text-small">李杨提交于 2019-10-8，需在 2019-12-20 前完成代码变更任务</p>
                  </el-col>
                </el-row>
              </el-col>
              <el-row :span="6"><el-tag type="danger">马上到期</el-tag></el-row>
            </el-row>
          </el-dropdown-item>
        </el-tab-pane>
      </el-tabs>
      <el-row class="bottom-bar">
        <el-col :span="12"><el-button type="text">清空 通知</el-button></el-col>
        <el-col :span="12"><el-button type="text">查看详情</el-button></el-col>
      </el-row>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'HeaderNotice',
  props: {},
  data() {
    return {
      activeName: 'notice'
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss">
  .notice-container {
    .el-badge__content {
      &.is-fixed {
        top: 20px!important;
      }
    }
  }
  .notice-tabs {
    width: 360px;
    .el-dropdown-menu__item {
      border-bottom: 1px solid #e8e8e8;
    }
    .el-tabs__nav-scroll, .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__nav {
      width: 100%;
    }
    .el-tabs__active-bar {
      /*width: 100px!important;*/
      /*margin: 0 10px!important;*/
    }
    .el-tabs__item {
      width: 33.33%;
      /*padding: 0 10px!important;*/
      text-align: center;
    }
    img {
      width: 32px;
      margin: 8px;
    }
    .notice-read {
      opacity: .4;
    }
    .text-small {
      font-size: 12px;
      color: #999999;
    }
  }
  .bottom-bar {
    height: 40px;
    padding: 0!important;
    .el-col {
      line-height: 40px;
      text-align: center;
      &:first-child {
        border-right: 1px solid #e8e8e8;
      }
    }
  }
</style>
