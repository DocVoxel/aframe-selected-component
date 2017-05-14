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
/***/ (function(module, exports) {

	// show object is selected
	// inspired by http://stemkoski.github.io/Three.js/Outline.html


	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * visible selections component for A-Frame.
	 */
	AFRAME.registerComponent('selected', {
	  schema: {
	    color: { type: 'color', default: '#FFF' },
	    selected: { default: true },
	    toggleOnClick: { default: true }
	  },

	  /**
	   * Set if component needs multiple instancing.
	   */
	  multiple: false,

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    this.outlineMesh = null;
	    var data = this.data;
	    var el = this.el;
	    this.toggleSelected = function () {
	      if (data.toggleOnClick) {
	        data.selected = !data.selected;
	        el.setAttribute('selected', { selected: data.selected });
	      }
	    }
	    this.el.addEventListener('click', this.toggleSelected);
	  },

	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   */
	  update: function (oldData) {
	    if (this.outlineMesh && !this.data.selected) {
	      this.el.object3D.remove(this.outlineMesh);
	      this.outlineMesh = null;
	    }
	    // TODO do we need to interate over all children?
	    if (this.data.selected && !this.outlineMesh) {
	      this.outlineMesh = this.el.object3D.children[0].clone();
	      var outlineMaterial = new THREE.MeshBasicMaterial({ color: this.data.color, side: THREE.BackSide });
	      this.outlineMesh.traverse(function (child) {
	        if (child instanceof THREE.Mesh) {
	          child.material = outlineMaterial;
	        }
	      });
	      this.outlineMesh.geometry.uvsNeedUpdate = true;
	      this.outlineMesh.needsUpdate = true;

	      this.outlineMesh.scale.multiplyScalar(1.05);
	      this.el.object3D.add(this.outlineMesh);
	    }
	    else if (oldData.selected && this.data.selected && (oldData.color !== this.data.color)) {
	      var data=this.data;
	      this.outlineMesh.traverse(function (child) {
	        if (child instanceof THREE.Mesh) {
	          child.material.color.set(data.color);
	        }
	      });
	    }
	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.https://github.com/devpaul/aframe-typings.git
	   */
	  remove: function () {
	    this.el.object3D.remove(this.outlineMesh);
	    this.outlineMesh = null;
	    this.el.removeEventListener('click', this.toggleSelected);
	  },

	  /**
	   * Called on each scene tick.
	   */
	  // tick: function (t) { },

	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	  pause: function () { },

	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	  play: function () { }
	});


/***/ })
/******/ ]);