module.exports = {
  title: '账务系统',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否显示站内搜索
   */
  showHeaderSearch: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示消息通知
   */
  showHeaderNotice: true,

  /**
   * @type {boolean} true | false
   * @description 是否显示国际化
   */
  showGlobal: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the footer
   */
  showFooter: true,

  /**
   * 底部文字，支持html语法
   */
  footerTxt: 'Copyright © 2011-2016 <a href="https://www.pax.com.cn/" target="_blank">百富计算机技术(深圳)有限公司</a> All Rights Reserved.',

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}
