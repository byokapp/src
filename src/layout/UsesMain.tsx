import { FunctionComponent } from 'preact';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Grid,
} from '@mui/material';

import ExternalLink from '@/components/ExternalLink';
import MediaCard from '@/components/MediaCard';

const UsesMain: FunctionComponent = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={8}>
        <Box>
          <Typography variant="h4">an Edge Serverless 100% client-side SPA/PWA </Typography>
          <Typography variant="h5">🟩 /uses</Typography>
          <List dense={false}>
            <ListItem disablePadding>
              <ListItemIcon>🦎</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://www.coingecko.com/en/terms">CoinGecko</ExternalLink>
                }
                secondary={
                  'free+reliable token prices - compares to Cryptocompare, Kaiko, Coinmarketcap'
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>E</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://docs.etherscan.io/">Etherscan API</ExternalLink>
                }
                secondary={
                  'multi-chain data - compares to higher-order data services, such as Nansen.ai, Covalent'
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>🔼</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://www.alchemy.com/sdk">Alchemy SDK</ExternalLink>
                }
                secondary={'processed chain data - compares to QuickNode, Moralis'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>e</ListItemIcon>
              <ListItemText
                primary={<ExternalLink href="https://docs.ethers.org/v6/">ethers.js</ExternalLink>}
                secondary={'raw chain data - compares to web3.js'}
              />
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemText
                primary={
                  <ExternalLink href="https://github.com/TomokiMiyauci/vite-preact">
                    starter
                  </ExternalLink>
                }
                secondary={'with Vite+Preact+TS+ESLint+Husky'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>🇹🇸</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://www.typescriptlang.org">TypeScript</ExternalLink>
                }
                secondary={'strongly-typed programming language (Microsoft) with modern tooling 💯'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>⚡</ListItemIcon>
              <ListItemText
                primary={<ExternalLink href="https://vitejs.dev">Vite</ExternalLink>}
                secondary={'native-ESM build tool with HMR (😸 no more Babel or Webpack)'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>⚛️</ListItemIcon>
              <ListItemText
                primary={<ExternalLink href="https://preactjs.com/">Preact</ExternalLink>}
                secondary={'stripped-down alternative to React (Meta/Facebook)'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>🥢</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://www.npmjs.com/package/wouter#preact-support">
                    Wouter
                  </ExternalLink>
                }
                secondary={'minimalist routing - compares to Next/React Router'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>⚡</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://github.com/feat-agency/vite-plugin-webfont-dl">
                    Webfont Download Vite Plugin
                  </ExternalLink>
                }
                secondary={
                  'privacy-first non-render blocking webfonts - compares to @fontsource, Google CDN'
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>🐻</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://docs.pmnd.rs/zustand/getting-started/introduction">
                    Zustand
                  </ExternalLink>
                }
                secondary={'bear necessities for React state management - compares to Redux, Jotai'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>🔴</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://radash-docs.vercel.app/docs/getting-started">
                    Radash
                  </ExternalLink>
                }
                secondary={
                  'modern, strongly-typed functional utility library - compares to Lodash, Ramda'
                }
              />
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemText
                primary={
                  <ExternalLink href="https://github.com/codedthemes/mantis-free-react-admin-template">
                    React template
                  </ExternalLink>
                }
                secondary={'Mantis combines MUI and Ant Design principles'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>MUI</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://mui.com/material-ui/getting-started/overview/">
                    Material UI
                  </ExternalLink>
                }
                secondary={'Material Design (Google) - compares to Bootstrap'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>A</ListItemIcon>
              <ListItemText
                primary={<ExternalLink href="https://apexcharts.com/">Apex Charts</ExternalLink>}
                secondary={'JS React Chart library - compares to Rechart, D3.js, Visx, Nivo'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>👩‍🎤</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://emotion.sh/docs/introduction">Emotion</ExternalLink>
                }
                secondary={'CSS-in-JS library - compares to Sass, Tailwind'}
              />
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemIcon>I</ListItemIcon>
              <ListItemText
                primary={<ExternalLink href="https://getinsights.io/">Insights</ExternalLink>}
                secondary={
                  'cookie-free, GDPR-compliant privacy analytics - compares to Google Analytics, Plausible'
                }
              />
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemIcon>VS</ListItemIcon>
              <ListItemText
                primary={<ExternalLink href="https://code.visualstudio.com/">VSCode</ExternalLink>}
                secondary={'cross-platform visual IDE (Microsoft)'}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>🗔🐧</ListItemIcon>
              <ListItemText
                primary={
                  <ExternalLink href="https://learn.microsoft.com/en-us/windows/wsl/compare-versions">
                    WSL2
                  </ExternalLink>
                }
                secondary={'Microsoft Linux'}
              />
            </ListItem>
          </List>
        </Box>
      </Grid>
      <Grid item xs={6} md={4}>
        <MediaCard component={'Uses'} />
      </Grid>
    </Grid>
  );
};

export default UsesMain;
