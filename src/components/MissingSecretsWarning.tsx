import { FunctionComponent } from 'preact';
import { Box, Tooltip, Typography } from '@mui/material';

import { missingAlchemyApiKey, missingEtherscanApiKey } from '@/constants';
import { Chain } from '@/types';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { useBoundStore } from '@/stores/useBoundStore';

const MissingSecretsWarning: FunctionComponent = () => {
  const secrets = usePersistentAppStore().secrets;

  const [showSecretsModal, setShowSecretsModal] = useBoundStore((state) => [
    state.showSecretsModal,
    state.setShowSecretsModal,
  ]);

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
      {!secrets.alchemy || !secrets.etherscan ? (
        <Tooltip title={'Secrets Manager'}>
          <span onClick={() => setShowSecretsModal(!showSecretsModal)}> Secrets Manager 🌩️ </span>
        </Tooltip>
      ) : undefined}
    </Box>
  );
};
export default MissingSecretsWarning;
