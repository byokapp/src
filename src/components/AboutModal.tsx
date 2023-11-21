import { FunctionComponent } from 'preact';
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';

import { APPNAME, CG_STATIC, ENS_IMAGE, GITHUB_IMAGE, SAFE_ICON } from '@/constants';
import { shortenHash } from '@/logic';
import { Chain } from '@/types';

import ExternalLink from './ExternalLink';

const ARB1_SAFE = '0x98b98cfF697A5Fe7cc250Beb26d89B2dE0cE054F';

interface AboutModalProps {
  showModal: boolean;
  toggleModal: () => void;
}
const AboutModal: FunctionComponent<AboutModalProps> = ({ toggleModal, showModal }) => {
  return (
    <Dialog open={showModal} onClose={toggleModal}>
      <DialogTitle>{APPNAME}</DialogTitle>
      <DialogContent>
        <DialogContentText>v0.92 Nov 2023</DialogContentText>
        <List dense={false}>
          <ListItem disablePadding>
            <ListItemText
              primary={'Support this project on-chain'}
              secondary={'Suggested: 30 USDC'}
            />
          </ListItem>
          <Tooltip title="Gnosis Safe ens:byokapp.eth">
            <ListItem disablePadding>
              <Avatar alt={'byokapp.eth'} src={SAFE_ICON} sx={{ height: 18, width: 18, mx: 0.5 }} />
              ETH Safe:
              <Avatar
                alt={'byokapp.eth'}
                src={CG_STATIC[Chain.ETH].image}
                sx={{ height: 24, width: 24, mx: 0 }}
              />
              <ExternalLink
                href={
                  'https://app.safe.global/home?safe=eth:0x4c4D83cC5913623Cc1B65EFeB9B40809D7e37181'
                }
              >
                byokapp.eth
              </ExternalLink>
            </ListItem>
          </Tooltip>
          <Tooltip title={'Gnosis Safe arb1:' + shortenHash(ARB1_SAFE)}>
            <ListItem disablePadding>
              <Avatar alt={ARB1_SAFE} src={SAFE_ICON} sx={{ height: 18, width: 18, mx: 0.5 }} />
              ARB1 Safe:
              <Avatar
                alt={ARB1_SAFE}
                src={CG_STATIC[Chain.ARBITRUM].image}
                sx={{ height: 18, width: 18, mx: 0.5 }}
              />
              <ExternalLink
                href={
                  'https://app.safe.global/home?safe=arb1:0x98b98cfF697A5Fe7cc250Beb26d89B2dE0cE054F'
                }
              >
                {shortenHash(ARB1_SAFE)}
              </ExternalLink>
            </ListItem>
          </Tooltip>
        </List>
      </DialogContent>
      <Divider />
      <Tooltip title={`birdie app: @artlu99`}>
        <DialogTitle>whoami</DialogTitle>
      </Tooltip>
      <DialogContent>
        <Tooltip title="byokapp.eth">
          <ListItem>
            <Avatar alt={'byokapp.eth'} src={ENS_IMAGE} sx={{ height: 18, width: 18, mx: 0.5 }} />
            byokapp.eth
          </ListItem>
        </Tooltip>
        <Tooltip title="artlu.eth">
          <ListItem>
            <Avatar alt={'artlu.eth'} src={ENS_IMAGE} sx={{ height: 18, width: 18, mx: 0.5 }} />
            artlu.eth
          </ListItem>
        </Tooltip>
      </DialogContent>
      <Divider />
      <Tooltip title={'GitHub: BYOK App'}>
        <DialogTitle>
          <ExternalLink href={'https://github.com/byokapp'}>
            <Avatar alt={'byokapp'} src={GITHUB_IMAGE} sx={{ height: 36, width: 36, mx: 0.5 }} />
          </ExternalLink>
        </DialogTitle>
      </Tooltip>
    </Dialog>
  );
};
export default AboutModal;
