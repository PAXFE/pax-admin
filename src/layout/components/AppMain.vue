<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 60= navbar  60  */
  min-height: calc(100vh - 60px);
  /*min-height: 100vh;*/
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f0f2f5;
}

.fixed-header+.app-main {
  padding-top: 60px;
  min-height: 100vh;
}

.hasTagsView {
  .app-main {
    /* 94 = navbar + tags-view = 60 + 34 */
    min-height: calc(100vh - 94px);
    /*min-height: 100vh;*/
  }

  .fixed-header+.app-main {
    padding-top: 94px;
    min-height: 100vh;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
