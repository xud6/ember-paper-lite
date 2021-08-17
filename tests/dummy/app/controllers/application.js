import { equal } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),
  actions: {
    toggleExpandedItem(value, ev) {
      if (this.expandedItem === value) {
        value = null;
      }
      this.set('expandedItem', value);
      ev.stopPropagation();
    }
  },

  expandedItem: 'demos',

  demosExpanded: equal('expandedItem', 'demos'),
  layoutExpanded: equal('expandedItem', 'layout')
});
