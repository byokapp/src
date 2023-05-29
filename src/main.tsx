import '@/styles/global.css';

import { init, parameters, track } from 'insights-js';
import { render } from 'preact';
import { Route, Switch } from 'wouter-preact';

import Home from '@/routes/Home';
import Uses from '@/routes/Uses';
import FourOhFour from '@/routes/404';

if (import.meta.env.PROD) {
  init('tADr0nTDbpkDES00');
  track({
    id: 'read-post',
    parameters: {
      locale: parameters.locale(),
      screenSize: parameters.screenType(),
    },
  });
}

const Main = () => {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/uses" component={Uses} />
      <Route component={FourOhFour} />
    </Switch>
  );
};

const entryPoint = document.getElementById('app');
if (entryPoint) render(<Main />, entryPoint);
