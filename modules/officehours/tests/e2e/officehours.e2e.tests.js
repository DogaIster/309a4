'use strict';

describe('Officehours E2E Tests:', function () {
  describe('Test Officehours page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/officehours');
      expect(element.all(by.repeater('officehour in officehours')).count()).toEqual(0);
    });
  });
});
