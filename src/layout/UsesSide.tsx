import { FunctionComponent } from 'preact';
import { Link } from 'wouter-preact';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const UsesSide: FunctionComponent = () => {
  return (
    <List dense={false}>
      <ListItem key={'Home'} disablePadding>
        <ListItemButton>
          <Link href="/">
            <ListItemText primary={'Home'} />
          </Link>
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default UsesSide;
