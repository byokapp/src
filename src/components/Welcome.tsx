import { FunctionComponent } from 'preact';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { Link } from 'wouter-preact';

import ExternalLink from './ExternalLink';
import MediaCard from './MediaCard';

const Welcome: FunctionComponent = () => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Box>
            <Divider />
            <Typography variant="h5" noWrap>
              Bring Your Own Address and API keys
            </Typography>
            <Typography variant="overline" display="block" sx={{ mb: 5 }}>
              Crypto values: transparency, decentralization, composability
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Crypto Native.
            </Typography>
            <Typography variant="subtitle1">naturally multi-chain (EVM) and ENS-aware</Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Private by Construction.
            </Typography>
            <Typography variant="subtitle1">
              everything lives in your browser and with third-party data providers—there is no
              database [<Link href="/uses">details</Link>] 👀
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
              FOSS.
            </Typography>
            <Typography variant="subtitle1">
              MIT-licensed, free as in beer, code is open for review [
              <ExternalLink href="https://github.com/byokapp/free">details</ExternalLink>] 👀
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <MediaCard component={'Welcome'} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Welcome;
