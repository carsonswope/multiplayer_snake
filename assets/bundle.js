/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	window.CONSTANTS = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function () {

	  window.s = io();
	  //
	  // s.emit('some event', {data: 'hah'} );
	  s.on('event', function (data) {
	    var x = JSON.parse(data.data);
	    console.log(x[0]);
	    console.log(x[1]);
	    console.log(s.id);
	  });

	  console.log(s.id);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.MS_PER_TICK = 550;
	exports.NUMBER_DTS_TO_STORE = 10;
	exports.NUM_FRAMES = 25;

	exports.PLAYER_STATES = {
	  PLAYING: 1,
	  PLACED: 2,
	  DEAD: 3
	};

	exports.PLAYER_MOVES = {
	  SET_STARTING_POS: 1,
	  SET_DIRECTION: 2
	};

	exports.DIRS = {
	  N: [-1, 0],
	  S: [1, 0],
	  E: [0, 1],
	  W: [0, -1]
	};

/***/ }
/******/ ]);