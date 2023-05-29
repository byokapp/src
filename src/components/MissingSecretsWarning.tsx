import { FunctionComponent } from 'preact';
import { Box, Typography } from '@mui/material';

import { missingAlchemyApiKey, missingEtherscanApiKey } from '@/constants';
import { Chain } from '@/types';
import { usePersistentAppStore } from '@/stores/persistentAppState';

const MissingSecretsWarning: FunctionComponent = () => {
  const secrets = usePersistentAppStore().secrets;

  return (
    <Box>
      {secrets.alchemy ? null : (
        <Typography variant="overline" display="block" gutterBottom sx={{ color: 'red' }}>
          {missingAlchemyApiKey()}
        </Typography>
      )}
      {secrets.etherscan ? null : (
        <Typography variant="overline" display="block" gutterBottom sx={{ color: 'red' }}>
          {missingEtherscanApiKey(Chain.ETH)}
        </Typography>
      )}
    </Box>
  );
};
export default MissingSecretsWarning;
