module.exports = {
  title: 'MassLink-MQ',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示站内搜索
   */
  showHeaderSearch: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示消息通知
   */
  showHeaderNotice: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示国际化
   */
  showGlobal: false,

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
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
