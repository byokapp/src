import { FunctionComponent } from 'preact';
import { Box, Divider, Typography } from '@mui/material';

const Introduction: FunctionComponent = () => {
  return (
    <Box sx={{ mb: 10 }}>
      <Divider />
      <Typography variant="h4" noWrap>
        Getting Started
      </Typography>

      <Typography variant="h6">
        🗸 Enter an ENS name, or paste an Ethereum address. Click [+] to Add.
      </Typography>

      <Typography variant="h6">
        ❇︎ [optional] Open Secrets Manager 🌩️ to provide your own private API keys.
      </Typography>
      <Typography variant="subtitle1">
        API access provides much better performance + data correctness. Free accounts available.
      </Typography>
    </Box>
  );
};
export default Introduction;
