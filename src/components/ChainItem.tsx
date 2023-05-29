import { FunctionComponent } from 'preact';

import { Chain } from '@/types';
import { Avatar } from '@mui/material';
import { CG_STATIC } from '@/constants';

type ChainItemProps = {
  chain: Chain;
};
const ChainItem: FunctionComponent<ChainItemProps> = ({ chain }) => {
  return (
    <Avatar
      alt={chain}
      src={CG_STATIC[chain].image}
      variant={chain === Chain.ETH ? 'rounded' : 'circular'}
      sx={{
        width: 24,
        height: 24,
        background: chain === Chain.MATIC ? 'transparent' : 'white',
      }}
    />
  );
};
export default ChainItem;
