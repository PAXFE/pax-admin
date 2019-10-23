import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const {
  showSettings,
  tagsView,
  fixedHeader,
  sidebarLogo,
  showHeaderSearch,
  showHeaderNotice,
  showGlobal
} = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  showHeaderSearch: showHeaderSearch,
  showHeaderNotice: showHeaderNotice,
  showGlobal: showGlobal
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

