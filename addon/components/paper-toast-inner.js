/**
 * @module ember-paper
 */
import Component from '@ember/component';

import { run } from '@ember/runloop';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import layout from '../templates/components/paper-toast-inner';
import TransitionMixin from 'ember-css-transitions/mixins/transition-mixin';
import { invokeAction } from 'ember-invoke-action';

/* global Hammer */

/**
 * @class PaperToastInner
 * @extends Ember.Component
 */
export default Component.extend(TransitionMixin, {
  layout,
  tagName: 'md-toast',
  transitionName: 'ng',

  dragging: false,

  x: 0,

  attributeBindings: ['style'],

  classNameBindings: ['left:md-left:md-right', 'top:md-top:md-bottom', 'capsule:md-capsule', 'dragging:md-dragging'],

  style: computed('x', function() {
    return htmlSafe(`transform:translate(${ this.x }px, 0)`);
  }),

  setValueFromEvent(event) {
    this.set('x', event);
  },

  _setupHammer() {
    // Enable dragging the slider
    let containerManager = new Hammer.Manager(this.element, {
      dragLockToAxis: true,
      dragBlockHorizontal: true
    });
    let swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL, threshold: 10 });
    let pan = new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 });
    containerManager.add(swipe);
    containerManager.add(pan);
    containerManager
      .on('panstart', run.bind(this, this.dragStart))
      .on('panmove', run.bind(this, this.drag))
      .on('panend', run.bind(this, this.dragEnd))
      .on('swiperight swipeleft', run.bind(this, this.dragEnd));
    this._hammer = containerManager;
  },

  didInsertElement() {
    this._super(...arguments);
    if (this.swipeToClose) {
      this._setupHammer();
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this.swipeToClose && !this._hammer) {
      // if it is enabled and we didn't init hammer yet
      this._setupHammer();
    } else if (!this.swipeToClose && this._hammer) {
      // if it is disabled and we did init hammer already
      this._teardownHammer();
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this._hammer) {
      this._teardownHammer();
    }
  },

  _teardownHammer() {
    this._hammer.destroy();
    delete this._hammer;
  },

  dragStart(event) {
    if (!this.swipeToClose) {
      return;
    }

    this.set('active', true);
    this.set('dragging', true);
    this.element.focus();

    this.setValueFromEvent(event.center.x);
  },

  drag(event) {
    if (!this.swipeToClose || !this.dragging) {
      return;
    }

    this.setValueFromEvent(event.deltaX);
  },

  dragEnd() {
    if (!this.swipeToClose) {
      return;
    }

    this.setProperties({
      active: false,
      dragging: false
    });

    invokeAction(this, 'onClose');
  }
}
);
