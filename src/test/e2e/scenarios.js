'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('heliotrope', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });

  describe('participant page', function() {

    beforeEach(function() {
      browser().navigateTo('/studies/GPS/participants/TST-001');
    });

    it('should render the participant page', function() {
      expect(element('h1:first').text()).toMatch("TST-001");
    });
  });

  describe('study page', function() {

    beforeEach(function() {
      browser().navigateTo('/studies/GPS');
    });

    it('should render the study page', function() {
      expect(element('h1:first').text()).toMatch("GPS");
    });
  });

  describe('variant page', function() {

    beforeEach(function() {
      browser().navigateTo('/genes/KRAS');
      element('#mutations-list a:first', 'p.Gly12Asp').click();
    });

    it('should render the variant page', function() {
      expect(element('h1:first').text()).toMatch("KRAS p.Gly12Asp");
      expect(element('#summary').text()).toMatch("missense_variant");
      expect(element('#clinical-action').text()).toMatch("activating");
      expect(element('#genomics').text()).toMatch("Codon: 12");
      expect(element('#clinical-action a:first').text()).toMatch("pmid:21311774");
    });

    it('should be able to navigate from the variant page to the gene page', function() {
      expect(element('#summary a:first').text()).toMatch("KRAS");
      element('#summary a:first', 'KRAS').click();
      expect(element('h1:first').text()).toMatch("KRAS");
    });
  });


  describe('gene page', function() {

    beforeEach(function() {
      browser().navigateTo('/genes/KRAS');
    });

    it('should render KRAS page when user navigates to /genes/KRAS', function() {
      expect(element('h1:first').text()).toMatch("KRAS");
    });

    it('should be able to navigate from KRAS page to a variant page', function() {
      expect(element('#mutations-list a:first').text()).toMatch("p.Gly12Asp");
      element('#mutations-list a:first', 'p.Gly12Asp').click();
      expect(element('h1:first').text()).toMatch("KRAS p.Gly12Asp");
    });
  });


  describe('home page', function() {

    beforeEach(function() {
      browser().navigateTo('/');
    });

    it('should render home page when user navigates to /', function() {
      expect(element('h1:first').text()).toMatch("Most frequently mutated genes");
    });

    it('should include the most common genes', function() {
      expect(element('#gene-frequencies-tab svg').text()).toMatch("TP53");
      expect(element('#gene-frequencies-tab svg').text()).toMatch("KRAS");
    });
  });


});