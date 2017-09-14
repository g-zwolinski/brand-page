const angular = require('angular');

export class FooterComponent {

	 constructor($scope, $document) {
		$scope.notIE = true;
	    //console.log($scope.notIE);
	    var msie = $document[0].documentMode;
	    // if is IE (documentMode contains IE version)
	    if (msie) {
	      // IE logic here
	      angular.element( document.querySelector('#menu')).css({'opacity': '0'});
	      $scope.notIE = false;
	      //console.log($scope.notIE);
	      if (msie === 9) {
	        // IE 9 logic here

	      }
	    }
	}
}

export default angular.module('directives.footer', ['duScroll'])
  .component('footer', {
    template: require('./footer.html'),
    controller: FooterComponent
  })
  .name;
