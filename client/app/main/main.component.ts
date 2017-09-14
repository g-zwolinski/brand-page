const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';

export class MainController {
  $http;

  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $scope, $mdDialog, $window, $rootScope, $document, $timeout) {
    this.$http = $http;

    if(!window.history || !history.replaceState) {
      return;
    }

    $scope.language = "ENG";

    $scope.toggleLanguage = function(){
      if($scope.language=='PL'){
        $scope.language='ENG';
      }else if($scope.language=='ENG'){
        $scope.language='PL';
      }
    };

    var isSendingRequest = false;
    var gotErrorWhileSending = false;
    //var tmpFormToShow = 'job';
    $scope.notSupportedBrowserInfoShow = false;
    $scope.notIE = true;
    //console.log($scope.notIE);
    var msie = $document[0].documentMode;
    // if is IE (documentMode contains IE version)
    if (msie) {
      // IE logic here
      var menu = angular.element(document.querySelector('#menu'));
      menu.css({'opacity': '0', 'visibility': 'hidden'});
      $scope.notIE = false;
      menu.addClass('hideOnIE');
      //console.log($scope.notIE);
      if (msie <= 9) {
        // IE <=9 logic here
        $scope.notSupportedBrowserInfoShow = true;
      }
    }else{
      //other Browsers, delete #menuIE
      var menuIE = angular.element(document).find('#menuIE');
      menuIE.remove();
    }

    $scope.submitForm = function() {
      
      if(!isSendingRequest){
        isSendingRequest = true;
        //var tmpFormToShow = $scope.contactForm.formToShow;
        //console.log($scope.contactForm);
        
        //if($scope.contactForm.message != null && ($scope.contactForm.message == null || $scope.contactForm.message == undefined)){
        //  $scope.contactForm.description =" ";
        //}

        $http.post('/api/things', { 
          authorContact: $scope.contactForm.authorContact,
          authorName: $scope.contactForm.authorName,
          complexity: $scope.contactForm.complexity,
          formToShow: $scope.contactForm.formToShow,
          message: $scope.contactForm.mainMessage[$scope.contactForm.formToShow],
          description: $scope.contactForm.contactForm,
          selectedJobType: $scope.contactForm.selectedJobType
        })
        .catch(function(data, status) {
          isSendingRequest = false;
          gotErrorWhileSending = true;
          $scope.showAlert();
          //console.error('Gists error', status, data);
        })
        .finally(function() {
          if(!gotErrorWhileSending){
            //console.log("finally finished gists");
            isSendingRequest = false;
            $scope.showThanks();
            //$scope.contactForm = {};
            $scope.contactForm.authorContact = "";
            $scope.contactForm.authorName = "";
            $scope.contactForm.mainMessage[$scope.contactForm.formToShow] = "";
            $scope.contactForm.selectedJobType = 0;
            $scope.contactForm.complexity = "priceNormal";
            //$scope.contactForm.formToShow = tmpFormToShow;
          }
          gotErrorWhileSending = false;
        });
      }
    };

    //prevent scroll when click from input to input (in form)
    var inputChecked = false;
    //pokaz/ukryj jezeli focus/blur input/textarea
    $scope.hideMenu = function(){
      inputChecked = true;
      $timeout(function(){
        inputChecked = false;
      },100);
      if($window.innerWidth < 732){
        $scope.showMenuBoolean = false;
      }
    }

    $scope.showMenu = function(id){
      $timeout(function(){
        if(inputChecked!=true){
          $scope.showMenuBoolean = true;
          //$scope.scrollTo(id);
        }
      }, 50);
       
    }

    //ie dialog jump issue
    var bodyScrollTopIE = 0;

    $scope.showAlert = function() {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      bodyScrollTopIE = document.documentElement.scrollTop;
      console.log(document.documentElement.scrollTop,document.body.scrollTop);
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Error :-(')
          .textContent('Plesae try again')
          .ariaLabel('Sorry')
          .ok('Got it!')
          //.targetEvent(ev)
      ).then(function(response){
        if(!$scope.notIE){
          document.documentElement.scrollTop = bodyScrollTopIE;
          console.log(document.documentElement.scrollTop,document.body.scrollTop);
        }
      });
    };


    $scope.showThanks = function() {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      bodyScrollTopIE = document.documentElement.scrollTop;
      console.log(document.documentElement.scrollTop,document.body.scrollTop);
      if($scope.contactForm.formToShow == 'job'){
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Thanks!')
            .textContent('We will contact you soon. Suggested price is '+$scope.jobTypes[$scope.contactForm.selectedJobType][$scope.contactForm.complexity] + ' PLN')
            .ariaLabel('Thanks')
            .ok('Got it!')
            //.targetEvent(ev)
        ).then(function(response){
          if(!$scope.notIE){
            document.documentElement.scrollTop = bodyScrollTopIE;
            console.log(document.documentElement.scrollTop,document.body.scrollTop);
          }
        });    

       }else{
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title('Thanks!')
            .textContent('We will contact you soon.')
            .ariaLabel('Thanks')
            .ok('Got it!')
            //.targetEvent(ev)
        ).then(function(response){
          if(!$scope.notIE){
            document.documentElement.scrollTop = bodyScrollTopIE;
            console.log(document.documentElement.scrollTop,document.body.scrollTop);
          }
        });     
       }

    };

    $scope.contactForm = {};
    $scope.contactForm.selectedJobType = 0;
    $scope.contactForm.complexity = "priceNormal";
    $scope.contactForm.description ="";
    $scope.contactForm.message ="";
    $scope.contactForm.mainMessage = {};
    $scope.contactForm.mainMessage['job'] = "";
    $scope.contactForm.mainMessage['message'] = "";

    $scope.jobTypes = [
      {
        name: 'Nazwa1', 
        description: 'Standarowy/a/e Nazwa1 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '10',
        priceNormal: '20',
        priceHard: '30'
      },
      {
        name: 'Nazwa2', 
        description: 'Standarowy/a/e Nazwa2 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '100',
        priceNormal: '200',
        priceHard: '300'
      },
      {
        name: 'Nazwa3', 
        description: 'Standarowy/a/e Nazwa3 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '10',
        priceNormal: '20',
        priceHard: '30'
      },
      {
        name: 'Nazwa4', 
        description: 'Standarowy/a/e Nazwa4 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '100',
        priceNormal: '200',
        priceHard: '300'
      },
      {
        name: 'Nazwa5', 
        description: 'Standarowy/a/e Nazwa5 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '10',
        priceNormal: '20',
        priceHard: '30'
      },
      {
        name: 'Nazwa6', 
        description: 'Standarowy/a/e Nazwa6 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '100',
        priceNormal: '200',
        priceHard: '300'
      },
      {
        name: 'Nazwa7', 
        description: 'Standarowy/a/e Nazwa7 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '10',
        priceNormal: '20',
        priceHard: '30'
      },
      {
        name: 'Nazwa8', 
        description: 'Standarowy/a/e Nazwa8 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '100',
        priceNormal: '200',
        priceHard: '300'
      },
      {
        name: 'Nazwa9', 
        description: 'Standarowy/a/e Nazwa9 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '10',
        priceNormal: '20',
        priceHard: '30'
      },
      {
        name: 'Nazwa10', 
        description: 'Standarowy/a/e Nazwa10 to coś tam, składa się z czegoś tam, zawieta ileś tam podstron. Robi to i to. Czas realizacji przybliżony. Twoj projekt wydaje sie:',
        priceEasy: '100',
        priceNormal: '200',
        priceHard: '300'
      }
    ];

    $window.onload = function() {
      //console.log('loaded',$document.scrollTop());
      $timeout(function(){
        $scope.ngLoaded = true;
        var body = angular.element(document).find('body');
        //body.css('background-color', '#294977');
        body.addClass('bodyGradient');
      }, 100);

      if($document.scrollTop()>0){
        //console.log('loaded',$document.scrollTop());
        $scope.menuConfig.activeSection = "About";
        var selectedSection = angular.element(document.getElementById('0'));
        $document.scrollToElementAnimated(selectedSection);
      }
    };

    $rootScope.$on('duScrollspy:becameActive', function($event, $element, $target){
      //Automaticly update location
      var hash = $element.prop('hash');
      //console.log($target[0].id);
      //console.log($target[0].id);
      if($scope.notIE == false){
          for(var i = 0;i<4;i++){
          //console.log(i);
          var section = angular.element(document.querySelector('#menuIEBtn'+i));
          //console.log(i, $target[0].id);
          //var section = document.getElementById('menuIEBtn'+i);
          if(i==parseInt($target[0].id)){
            //console.log('found', '#menuIEBtn'+i, $scope.activeMenuIE[i], $scope.activeSectionIE);
            section.addClass('active');
            //section.className += "active";
          }else{
            section.removeClass('active');
          }
        }    
      }

      if($scope.menuItems[0].show!='0'){
        var wingList = document.getElementsByClassName("wing");
        //console.log($scope.menuConfig.activeSection, $target[0].id);
        for(var i = 0;i < wingList.length;i++){
          //console.log(wingList[i], scope.wings[i]);
          //console.log($scope.menuItems[i].show);
          //index zgodny z kolejnoscia sekcji i menu
          if(i == $target[0].id && angular.element(wingList[i].querySelector('svg').querySelector('path')).hasClass('active')){
            angular.element(wingList[i]).css("transform","rotate("+$scope.menuItems[i].rotate+") scale(1.2)");
          }else{
            angular.element(wingList[i]).css("transform","rotate("+$scope.menuItems[i].rotate+") scale(1)");
          }
        } 
      }

      if (hash) {
        //console.log(hash);
        //history.replaceState(null, null, hash);
      }
    });

    $scope.scrlTop = $document.scrollTop();

    var removing = false;

    $document.on('scroll', function() {

      //console.log($document.scrollTop(),$scope.scrlTop);
      if($document.scrollTop()!=$scope.scrlTop && $scope.firstTime == true){
        $scope.setMenuPos();
      }
      $scope.scrlTop = $document.scrollTop();
      /*
      if($document.scrollTop()>$scope.scrlTop){
        //skroll w dol
        if($window.innerWidth < 732){
          //console.log('maly ekran w dol');
          angular.element( document.querySelector('#menu')).css({'position': 'fixed', 'left': '200vw','transition':'all 100ms'});
        }else{
          //console.log('duzy ekran w dol');
        }
      }else if($document.scrollTop()<$scope.scrlTop){
        //skroll w gore
        if($window.innerWidth < 732){
          //console.log('maly ekran w gore');
          angular.element( document.querySelector('#menu')).css({'position': 'fixed', 'left': '30px','transition':'all 100ms'});
        }else{
          angular.element( document.querySelector('#menu')).css({'position': 'fixed', 'left': '30px','transition':'all 100ms'});
          //console.log('duzy ekran w gore');
        }
      }
      $scope.scrlTop = $document.scrollTop();
      //remove transition
      $timeout(function(){
        angular.element( document.querySelector('#menu')).css({'transition':'none'});
      },100);
      */

    });

    $scope.buttonWidth = $window.innerWidth/2;
    $scope.gutterLeft = $window.innerWidth/2-$scope.buttonWidth/2;

    $scope.onWingClick1 = function(wing){
      //console.log(wing);
      if(wing.title=='PL' || wing.title=='ENG'){
        if($scope.language=='PL'){
          $scope.language='ENG';
        }else if($scope.language=='ENG'){
          $scope.language='PL';
        }
        if($scope.firstTime == true){
          $document.scrollToElementAnimated(angular.element(document.getElementById('0')));
        }
      }
      //console.log($scope.language);
    };

    $scope.firstTime = true;

    $scope.scrollTo = function(id){
      var selectedSection = angular.element(document.getElementById(id));
      $document.scrollToElementAnimated(selectedSection);
      //console.log(id);
      if($scope.firstTime == true){
        //$scope.setMenuPos();
      }
    };

    $scope.setMenuPos = function(){
      $scope.firstTime = false;
      
      //var section0 = angular.element(document.getElementById('0'));
     // $document.scrollToElementAnimated(section0);
      
      var introPage = angular.element(document.getElementById('introPage'));
      document.getElementById('introPage').innerHTML = '';
      introPage.css({'height': '0px'});
      $timeout(function(){
        //console.log($scope.menuConfig.activeSection);
        if($scope.menuConfig.activeSection == 'start' || $scope.menuConfig.activeSection=='PL' || $scope.menuConfig.activeSection == 'ENG'){
          $scope.menuConfig.activeSection = 'About';
        }
        //console.log($scope.menuConfig.activeSection);
        switch($scope.menuConfig.activeSection){
          case 'About':
            $scope.menuConfig.activeSection = "About";
            var selectedSection = angular.element(document.getElementById('0'));
            //console.log(selectedSection);
            $document.scrollToElementAnimated(selectedSection);
          break;
          case 'Offer':
            $scope.menuConfig.activeSection = "Offer";
            var selectedSection = angular.element(document.getElementById('1'));
            $document.scrollToElementAnimated(selectedSection);
          break;
          case 'Details':
            $scope.menuConfig.activeSection = "Details";
            var selectedSection = angular.element(document.getElementById('2'));
            $document.scrollToElementAnimated(selectedSection);
          break;
          case 'Contact':
            $scope.menuConfig.activeSection = "Contact";
            var selectedSection = angular.element(document.getElementById('3'));
            $document.scrollToElementAnimated(selectedSection);
          break;
        }
      }, 600);
      //introPage.remove();
    };

    $scope.menuConfig = {
      "activeSection": 'start',
      "buttonWidth": 60,
      "menuRadius": 150,
      "color": "#1E67B5",
      "offset": 0,
      "textColor": "#ffffff",
      "showIcons":false,
      "onlyIcon":false,
      "textAndIcon": false,
      "gutter": {
        "top": 30,
        "right": 30,
        "bottom": 30,
        "left":  30
      },
      "angles": {
        "topLeft": 0,
        "topRight": 90,
        "bottomRight": 180,
        "bottomLeft": 270
      }
    };
    $scope.menuItems = [{
      "title": "About",
      "color": "#1E67B5",
      "rotate": 0,
      "show": 0,
      "titleColor": "#fff",
      "icon":{"color":"#fff","name":"fa fa-tablet","size": 35}
    }, {
      "title": "Offer",
      "color": "#1E67B5",
      "rotate": 0,
      "show": 0,
      "titleColor": "#fff",
      "icon":{"color":"#fff","name":"fa fa-laptop","size": 30}
    }, {
      "title": "Details",
      "color": "#1E67B5",
      "rotate": 0,
      "show": 0,
      "titleColor": "#fff",
      "icon":{"color":"#fff","name":"fa fa-mobile","size": 30}
    }, {
      "title": "Contact",
      "color": "#1E67B5",
      "rotate": 0,
      "show": 0,
      "titleColor": "#fff",
      "icon":{"color":"#fff","name":"fa fa-clock-o","size": 30}
    }, {
      "title": "PL",
      "color": "#294977",
      "rotate": 100,
      "show": 0,
      "titleColor": "#fff",
      "icon":{"color":"#fff","name":"fa fa-clock-o","size": 30}
    }];
  }

  $onInit() {
    /*
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
    });
    */
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

export default angular.module('knotApp.main', [
  uiRouter])
    .directive('animateOnChange', function($timeout) {
      return function(scope, element, attr) {
        scope.$watch(attr.animateOnChange, function(nv,ov) {
          if (nv!=ov) {
            element.addClass('changed');
            $timeout(function() {
              element.removeClass('changed');
            }, 100); // Could be enhanced to take duration as a parameter
          }
        });

        if(attr.animateOnChangeAdditional != null || attr.animateOnChangeAdditional != undefined){
          scope.$watch(attr.animateOnChangeAdditional, function(nv,ov) {
            if (nv!=ov) {
              element.addClass('changed');
              $timeout(function() {
                element.removeClass('changed');
              }, 100); // Could be enhanced to take duration as a parameter
            }
          });
        }
      };
    })
    .config(routing)
    .component('main', {
      template: require('./main.html'),
      controller: MainController
    })
    .name;
