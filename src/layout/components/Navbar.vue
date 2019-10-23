<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
<!--    <img class="logo" src="@/assets/images/logo.png" alt="logo">-->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search v-if="showHeaderSearch" id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

      </template>

      <!-- notice start -->
      <notice v-if="showHeaderNotice" />
      <!-- notice end -->

      <!-- avatar start -->
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
<!--          <img src="@/assets/images/user2.png" class="user-avatar">-->
          <span class="svg-container">
            <svg-icon icon-class="user4" />
          </span>
          <p>{{ name }}</p>
<!--          <i class="el-icon-caret-bottom" />-->
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/profile/index"><svg-icon icon-class="user3" /> 个人中心</router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout"><svg-icon icon-class="logout" /> 退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- avatar end -->

      <!-- 国际化 start -->
      <el-dropdown v-if="showGlobal" class="global-container right-menu-item hover-effect">
        <svg-icon icon-class="earth" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>简体中文</el-dropdown-item>
          <el-dropdown-item>繁体中文</el-dropdown-item>
          <el-dropdown-item>English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 国际化 end -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Search from '@/components/HeaderSearch'
import Notice from '@/components/HeaderNotice'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Search,
    Notice
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      'avatar',
      'device'
    ]),
    ...mapState({
      showHeaderSearch: state => state.settings.showHeaderSearch,
      showHeaderNotice: state => state.settings.showHeaderNotice,
      showGlobal: state => state.settings.showGlobal
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  /*border-bottom: 1px solid #dddddd;*/
  padding-right: 20px;
  .logo {
    margin: 10px 20px;
  }
  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        justify-content: flex-end;
        line-height: 50px;
        .svg-container {
          margin-right: 5px;
        }
        p {
          font-size: 12px;
        }

        .user-avatar {
          cursor: pointer;
          width: 20px;
          height: 20px;
          margin: 15px 5px 0 0;
          /*border-radius: 10px;*/
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
