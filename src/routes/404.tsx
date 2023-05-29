import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link, useLocation } from 'wouter-preact';

import { wait } from '@/logic';

const FourOhFour: FunctionComponent = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const waitAndRedirect = async (ms: number) => {
      await wait(ms);
      setLocation('/');
    };
    waitAndRedirect(5 * 1000); // 5 seconds
  }, []);

  return (
    <div className="FourOhFour">
      <h5>This is not a 404, but Wouter will send you home in ~5 seconds...</h5>
      <h3>Oops...this link does not work.</h3>
      <h3>
        Try going <Link href="/">Home</Link> instead 👋
      </h3>
    </div>
  );
};

export default FourOhFour;
