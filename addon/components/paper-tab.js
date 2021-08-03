import { computed } from '@ember/object';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import layout from '../templates/components/paper-tab';
import { ChildMixin } from 'ember-composability-tools';
import FocusableMixin from 'ember-paper-lite/mixins/focusable-mixin';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend(ChildMixin, FocusableMixin, {
  layout,
  tagName: 'md-tab-item',
  classNames: ['md-tab'],
  classNameBindings: ['isSelected:md-active'],
  attributeBindings: ['isSelected:aria-selected', 'style', 'maybeHref:href'],

  // <a> tags have browser styles or are usually styled by the user
  // this makes sure that tab item still looks good with an anchor tag
  style: computed('href', function() {
    if (this.get('href')) {
      return htmlSafe('text-decoration: none; border: none;');
    } else {
      return undefined;
    }
  }),

  maybeHref: computed('href', 'disabled', function() {
    if (this.get('href') && !this.get('disabled')) {
      return this.get('href');
    } else {
      return undefined;
    }
  }),

  isSelected: computed('selected', 'value', function() {
    return this.get('selected') === this.get('value');
  }),

  init() {
    this._super(...arguments);
    if (this.get('href')) {
      this.set('tagName', 'a');
    }
  },

  // this method is called by the parent
  updateDimensions() {
    // this is the true current width
    // it is used to calculate the ink bar position & pagination offset
    this.setProperties({
      left: this.element.offsetLeft,
      width: this.element.offsetWidth
    });
  },

  click() {
    if (!this.get('disabled')) {
      invokeAction(this, 'onClick', ...arguments);
      invokeAction(this, 'onSelect', this);
    }
  }
});
