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
