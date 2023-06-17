import { FunctionComponent } from 'preact';
import { Box, CssBaseline, Drawer, Toolbar } from '@mui/material';

import { PageStyle, drawerWidth } from '@/config';

import MainView from '@/layout/MainView';
import SideBar from '@/layout/SideBar';
import TopBar from '@/layout/TopBar';
import UsesSide from './UsesSide';
import UsesMain from './UsesMain';

interface PageLayoutProps {
  layoutStyle: PageStyle;
}
const PageLayout: FunctionComponent<PageLayoutProps> = ({ layoutStyle }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar sparse={layoutStyle !== PageStyle.MAIN} />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {layoutStyle === PageStyle.MAIN ? <SideBar /> : <UsesSide />}
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {layoutStyle === PageStyle.MAIN ? <MainView /> : <UsesMain />}
      </Box>
    </Box>
  );
};

export default PageLayout;
