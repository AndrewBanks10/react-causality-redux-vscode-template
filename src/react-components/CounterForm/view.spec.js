import assert from 'assert';
import { testCauseAndEffectWithHtmlString } from '../../../test/projectsetup';
import history from '../../../src/history/history';
import { COUNTERROUTE } from '../MainApp/MainApp';

describe('View CounterForm', function () {
    this.slow(200);
    before(function (done) {
        history.replace(COUNTERROUTE);
        done();
      });
    // Click on the increment button  
    it('increment cause and effect 1 - validated.', function(done) {
        testCauseAndEffectWithHtmlString('#onIncrement', '#counter-text', 'The current counter is 1.', done);
    });

    // Click on the increment button  
    it('increment cause and effect 2 - validated.', function(done) {
        testCauseAndEffectWithHtmlString('#onIncrement', '#counter-text', 'The current counter is 2.', done);
    });

     // Click on the decrement button  
    it('decrement cause and effect 1 - validated.', function(done) {
        testCauseAndEffectWithHtmlString('#onDecrement', '#counter-text', 'The current counter is 1.', done);
    });

     // Click on the decrement button  
    it('decrement cause and effect 2 - validated.', function(done) {
        testCauseAndEffectWithHtmlString('#onDecrement', '#counter-text', 'The current counter is 0.', done);
    });

});

const exit = 0;