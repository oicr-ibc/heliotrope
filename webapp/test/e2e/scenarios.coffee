'use strict'

# http://docs.angularjs.org/guide/dev_guide.e2e-testing

describe 'heliotrope', () ->

  beforeEach () ->
    browser().navigateTo '../../app/index.html'

  it 'should automatically redirect to / when location hash/fragment is empty', () ->
    expect(browser().location().url()).toBe("")

  describe 'gene page', () ->

    beforeEach () ->
      browser().navigateTo('/genes/KRAS')

    it 'should render KRAS page when user navigates to /genes/KRAS', () ->
      sleep(3)
      expect(element('h1:first').text()).toMatch("KRAS")

  describe 'home page', () ->

    beforeEach () ->
      browser().navigateTo('/')

    it 'should render home page when user navigates to /', () ->
      sleep(3)
      expect(element('h1:first').text()).toMatch("Most frequently mutated genes")
