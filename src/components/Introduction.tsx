import { FunctionComponent } from 'preact';
import { Box, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';

import { useBoundStore } from '@/stores/useBoundStore';

const Introduction: FunctionComponent = () => {
  const [showSecretsModal, setShowSecretsModal] = useBoundStore((state) => [
    state.showSecretsModal,
    state.setShowSecretsModal,
  ]);

  return (
    <Box sx={{ mb: 4 }}>
      <List>
        <ListItem>
          <Typography variant="h6">
            ❇︎ [<i>optional</i>] Open the
            <Tooltip title={'Secrets Manager'}>
              <span onClick={() => setShowSecretsModal(!showSecretsModal)}>
                {' '}
                Secrets Manager 🌩️{' '}
              </span>
            </Tooltip>
            to provide your own private API keys
          </Typography>
        </ListItem>
        <ListItemText inset>
          <Typography variant="subtitle1">
            – API access provides much better performance + data correctness
          </Typography>
        </ListItemText>
        <ListItemText inset>
          <Typography variant="subtitle1">– Free accounts available</Typography>
        </ListItemText>
      </List>
    </Box>
  );
};
export default Introduction;
