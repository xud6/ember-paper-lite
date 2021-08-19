/**
 * @module ember-paper
 */
import PaperRadioBaseComponent from './paper-radio-base';
import { ChildMixin } from '@ember-paper-lite/ember-composability-tools';

/**
 * @class PaperRadio
 * @extends PaperRadioBaseComponent
 * @uses ChildMixin
 */
export default PaperRadioBaseComponent.extend(ChildMixin, {
  shouldRegister: false
});
