'use strict';
const angular = require('angular');
//import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');


const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
// const ngMessages = require('angular-messages');



import {routeConfig} from './app.config';


import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';



import './app.scss';



require('../../node_modules/cuppa-angular-menu/app/scripts/circularmenu-directive.js');
require('../../node_modules/angular-scroll/angular-scroll.js');

require('../../node_modules/angular-material/angular-material.css');

//wymagane przez angular-material
require('../../node_modules/angular-animate/angular-animate.js');
require('../../node_modules/angular-aria/angular-aria.js');
require('../../node_modules/angular-messages/angular-messages.js');
require('../../node_modules/angular-material/angular-material.js');

angular.module('knotApp', [
  ngCookies,
  ngResource,
  ngSanitize,


  uiRouter,
  uiBootstrap,
  navbar,
  footer,
  main,
  constants,

  util,

  'circularMenu-directive',
  'duScroll',
  'ngMaterial', 
  'ngMessages'
])
  .config(routeConfig)
  .config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('none')
    $mdThemingProvider.setDefaultTheme('none');
    $mdThemingProvider.disableTheming();
   }])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
   }])
  .config(['$mdGestureProvider', function($mdGestureProvider) {

    // For mobile devices without jQuery loaded, do not
    // intercept click events during the capture phase.
    $mdGestureProvider.skipClickHijack();

  }]);


angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['knotApp'], {
      strictDi: true
    });
  });
