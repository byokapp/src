import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Box, Divider, ListItem, Menu, MenuItem, Tooltip } from '@mui/material';

import { CG_STATIC, SUPPORTED_CHAINS } from '@/constants';
import { mapIdToChain } from '@/logic';
import { useBoundStore } from '@/stores/useBoundStore';
import ChainItem from './ChainItem';

const ChainsMenu: FunctionComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [activeChain, setActiveChain] = useBoundStore((state) => [
    state.activeChain,
    state.setActiveChain,
  ]);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    const maybeChain = mapIdToChain(event.currentTarget.id);
    if (maybeChain) setActiveChain(maybeChain);

    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={CG_STATIC[activeChain].name}>
        <Box
          onClick={handleClick}
          aria-controls={open ? 'chains-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <ChainItem chain={activeChain} />
        </Box>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="chains-menu"
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
        {SUPPORTED_CHAINS.filter((chain) => chain !== activeChain).map((chain) => (
          <MenuItem onClick={handleClose} id={CG_STATIC[chain].id}>
            <ChainItem chain={chain} /> {CG_STATIC[chain].name}
          </MenuItem>
        ))}
        <Divider />
        <ListItem>🖇️ switch Chain</ListItem>
      </Menu>
    </>
  );
};
export default ChainsMenu;
