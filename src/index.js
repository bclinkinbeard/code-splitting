console.log('MAIN BUNDLE loaded');

window.go = function () {

  // require.ensure(['./DYNAMIC_SECTION_ASSET'], function (require) {
  require.ensure([], function (require) {
    console.log(require('./DYNAMIC_SECTION'), 'loaded');
  }, 'DYNAMIC_SECTION')

}
