import { FunctionComponent } from 'preact';

import { PageStyle } from '@/config';

import PageLayout from '@/layout/PageLayout';

const Uses: FunctionComponent = () => {
  return <PageLayout layoutStyle={PageStyle.USES} />;
};

export default Uses;
