require.ensure([], function (require) {
  console.log(require('./DYNAMIC_SECTION_ASSET'), 'loaded');
}, 'DYNAMIC_SECTION_ASSET')

module.exports = 'DYNAMIC SECTION';
