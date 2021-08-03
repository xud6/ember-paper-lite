import { bool } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import layout from '../templates/components/paper-tooltip-inner';
import TransitionMixin, { nextTick } from 'ember-css-transitions/mixins/transition-mixin';
import calculateTooltipPosition from 'ember-paper-lite/utils/calculate-tooltip-position';

export default Component.extend(TransitionMixin, {
  layout,
  tagName: 'md-tooltip',
  attributeBindings: ['style'],
  classNames: ['md-tooltip', 'md-panel'],
  classNameBindings: ['positionClass'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  transitionClassNameBindings: ['show:md-show', 'hide:md-hide'],
  show: bool('style'),

  positionClass: computed('position', function() {
    return `md-origin-${this.position}`;
  }),

  didInsertElement() {
    this._super(...arguments);
    run.schedule('afterRender', () => {
      if (!this.isDestroyed) {
        let anchorElement = this.anchorElement;
        let pos = calculateTooltipPosition(this.element, anchorElement, this.position);
        this.set('style', htmlSafe(`top: ${pos.top}px; left: ${pos.left}px`));
        this.set('hide', true);
        nextTick().then(nextTick).then(nextTick).then(nextTick).then(() => {
          if (!this.isDestroyed) {
            this.set('hide', false);
          }
        });
      }
    });
  }
});
