// models/user.js

import Model, { attr } from '@ember-data/model';
import EmberCpValidations from 'ember-cp-validations';

const { validator, buildValidations } = EmberCpValidations;

const Validations = buildValidations({
  username: validator('presence', true),
  password: [
    validator('presence', true),
    validator('length', {
      min: 4,
      max: 8
    })
  ],
  email: [
    validator('presence', true),
    validator('format', { type: 'email' })
  ],
  emailConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'email',
      message: '{description} do not match',
      description: 'Emails'
    })
  ]
});

export default Model.extend(Validations, {
  username: attr('string'),
  password: attr('string'),
  email: attr('string')
});
