import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { CreditCard } from 'preact-feather';
import { Badge, Box, Divider, ListItem, Menu, MenuItem, Tooltip } from '@mui/material';

import { usePersistentAppStore } from '@/stores/persistentAppState';
import { Wallet } from '@/types';
import { shortenHash } from '@/logic';

const getWalletId = (wallet: Wallet | undefined): string =>
  wallet && wallet?.id ? wallet.id.toString() : '<missing wallet id';

const WalletsMenu: FunctionComponent = () => {
  const { wallets, activeWalletId, setActiveWalletId } = usePersistentAppStore();
  const activeWallet = wallets.find((w) => w.id === activeWalletId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    const maybeId = event.currentTarget.id;
    const maybeWallet = wallets.find((wallet) => wallet.id === Number(maybeId));
    if (maybeWallet) setActiveWalletId(maybeWallet.id);

    setAnchorEl(null);
  };

  return (
    <>
      {activeWallet ? (
        <Tooltip title={shortenHash(activeWallet.walletAddress)}>
          {wallets.length > 1 ? (
            <Box
              onClick={handleClick}
              aria-controls={open ? 'wallets-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {activeWallet.walletName}
            </Box>
          ) : (
            <Box>{activeWallet.walletName}</Box>
          )}
        </Tooltip>
      ) : (
        <Tooltip title="Select Wallet">
          <Box
            onClick={handleClick}
            aria-controls={open ? 'wallets-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Badge
              color="info"
              badgeContent={wallets.length}
              invisible={wallets.length < 2}
              max={10}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <CreditCard />
            </Badge>
          </Box>
        </Tooltip>
      )}
      <Menu
        anchorEl={anchorEl}
        id="wallets-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {wallets
          .filter((wallet) => (activeWalletId ? wallet.id !== activeWalletId : true))
          .map((wallet) => (
            <Tooltip title={shortenHash(wallet.walletAddress)}>
              <MenuItem onClick={handleClose} id={getWalletId(wallet)}>
                {wallet.walletName}
              </MenuItem>
            </Tooltip>
          ))}
        {activeWallet ? (
          <>
            <Divider />
            <ListItem>switch Wallet 💳</ListItem>
          </>
        ) : undefined}
      </Menu>
    </>
  );
};
export default WalletsMenu;
