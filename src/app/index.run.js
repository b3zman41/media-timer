(function() {
  'use strict';

  angular
    .module('mediatimer')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
