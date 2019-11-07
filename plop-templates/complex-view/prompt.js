const { notEmpty } = require('../utils.js')

module.exports = {
  description: '生成一个带 table 和 form 表单的页面',
  prompts: [{
    type: 'input',
    name: 'name',
    message: '请输入页面名称',
    validate: notEmpty('name')
  }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `src/views/${name}/index.vue`,
      templateFile: 'plop-templates/complex-view/index.hbs',
      data: {
        name: name
      }
    },
    {
      type: 'add',
      path: `src/views/${name}/form.vue`,
      templateFile: 'plop-templates/complex-view/form.hbs',
      data: {
        name: name
      }
    },
    {
      type: 'add',
      path: `src/api/${name}.js`,
      templateFile: 'plop-templates/complex-view/api.hbs',
      data: {
        name: name
      }
    }]

    return actions
  }
}
