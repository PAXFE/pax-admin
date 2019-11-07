const simpleViewGenerator = require('./plop-templates/simple-view/prompt')
const complexViewGenerator = require('./plop-templates/complex-view/prompt')
const componentGenerator = require('./plop-templates/component/prompt')

module.exports = function(plop) {
  plop.setGenerator('complex-view', complexViewGenerator)
  plop.setGenerator('simple-view', simpleViewGenerator)
  plop.setGenerator('component', componentGenerator)
}
