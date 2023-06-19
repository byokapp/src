import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { ChevronLeft } from 'preact-feather';
import { Box, CssBaseline, Divider, Drawer, IconButton, Toolbar, styled } from '@mui/material';

import { PageStyle, drawerWidth } from '@/config';

import MainView from '@/layout/MainView';
import SideBar from '@/layout/SideBar';
import TopBar from '@/layout/TopBar';
import UsesSide from './UsesSide';
import UsesMain from './UsesMain';

const DrawerControls = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface PageLayoutProps {
  layoutStyle: PageStyle;
}
const PageLayout: FunctionComponent<PageLayoutProps> = ({ layoutStyle }) => {
  const width =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const [open, setOpen] = useState(width > 767);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar
        sparse={layoutStyle !== PageStyle.MAIN}
        drawerOpen={open}
        handleDrawerOpen={() => setOpen(true)}
      />
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {layoutStyle === PageStyle.MAIN ? <SideBar /> : <UsesSide />}
        </Box>
        <Divider />
        <DrawerControls>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft size={25} />
          </IconButton>
        </DrawerControls>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {layoutStyle === PageStyle.MAIN ? <MainView /> : <UsesMain />}
      </Box>
    </Box>
  );
};

export default PageLayout;
