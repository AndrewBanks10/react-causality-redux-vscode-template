import assert from 'assert'
import { findNodeFunction, update, nodeExists, testCauseAndEffectWithExists, testCauseAndEffectWithNotExists } from '../../../../test/projectsetup'
import history from '../../../../src/history/history'
import { newsRoute } from '../../../util/routes'

//
// This verifies the NewsForm component and its business logic.
//
describe('View NewsForm', function () {
  this.slow(2000)
  before(function () {
    history.replace(newsRoute)
    update()
  })

  // Prove there are no news sources
  it('getNewsSourcesEffect does not exist - validated.', function () {
    assert(!nodeExists('[data-newsrow]'))
  })

  // Now click on the news source button and wait for the effect.
  it('getNewsSources cause and effect - validated.', function (done) {
    testCauseAndEffectWithExists(findNodeFunction('button', 'getNewsSources'), '[data-newsrow]', done)
  })

  // Prove there are no news articles
  it('getNewsEffect does not exist - validated.', function () {
    assert(!nodeExists('#getNewsEffect'))
  })

  // Click on the first news source to get all the latest news from that source.
  // Wait for the news to come back.
  it('getNews cause and effect - validated.', function (done) {
    testCauseAndEffectWithExists('[data-newsrow]', '#getNewsEffect', done)
  })

  // Click on the close news. Prove it works.
  it('Exit news - validated.', function (done) {
    testCauseAndEffectWithNotExists('#closeNews', '#getNewsEffect', done)
  })

  // Clear out the news sources. Prove it works.
  it('getNewsSources cleared validated.', function (done) {
    testCauseAndEffectWithNotExists(findNodeFunction('button', 'clearNewsSources'), '[data-newsrow]', done)
  })
})
