/**
 * @module ember-paper
 */
import { inject as service } from '@ember/service';

import { filterBy, mapBy, notEmpty } from '@ember/object/computed';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import layout from '../templates/components/paper-radio-group';
import FocusableMixin from 'ember-paper-lite/mixins/focusable-mixin';
import { ParentMixin } from '@ember-paper-lite/ember-composability-tools';
import { isPresent } from '@ember/utils';
import { invokeAction } from 'ember-invoke-action';

/**
 * @class PaperRadioGroup
 * @extends Ember.Component
 * @uses FocusableMixin
 * @uses ParentMixin
 */
export default Component.extend(FocusableMixin, ParentMixin, {
  layout,
  tagName: 'md-radio-group',
  tabindex: 0,

  /* FocusableMixin Overrides */
  focusOnlyOnKey: true,

  radioComponent: 'paper-radio',
  labelComponent: 'paper-radio-group-label',
  role: 'radiogroup',

  constants: service(),

  // Lifecycle hooks
  init() {
    this._super(...arguments);
    assert('{{paper-radio-group}} requires an `onChange` action or null for no action', this.onChange !== undefined);
  },

  attributeBindings: [
    'role',
    'ariaLabelledby:aria-labelledby'
  ],

  enabledChildRadios: filterBy('childComponents', 'disabled', false),
  childValues: mapBy('enabledChildRadios', 'value'),
  hasLabel: notEmpty('labelNode'),

  keyDown(ev) {

    switch (ev.which) {
      case this.constants.KEYCODE.LEFT_ARROW:
      case this.constants.KEYCODE.UP_ARROW:
        ev.preventDefault();
        this.select(-1);
        break;
      case this.constants.KEYCODE.RIGHT_ARROW:
      case this.constants.KEYCODE.DOWN_ARROW:
        ev.preventDefault();
        this.select(1);
        break;
    }
  },

  select(increment) {
    let groupValue = this.groupValue;
    let index = 0;

    if (isPresent(groupValue)) {
      index = this.childValues.indexOf(groupValue);
      index += increment;
      let length = this.childValues.length;
      index = ((index % length) + length) % length;
    }

    let childRadio = this.enabledChildRadios.objectAt(index);
    childRadio.set('focused', true);
    invokeAction(this, 'onChange', childRadio.get('value'));
  },

  actions: {
    onChange(value) {
      invokeAction(this, 'onChange', value);
    }
  }
});
