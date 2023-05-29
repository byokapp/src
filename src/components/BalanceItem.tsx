import { FunctionComponent } from 'preact';
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  styled,
} from '@mui/material';
import { commifyNumberString, dollarify } from '@/logic';
import moment from 'moment';
import { DATETIME_FORMAT, DISPLAY_DECIMALS } from '@/constants';
import { numberString } from '@/types';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
  right: '15px',
  bottom: '5px',
}));

type BalanceItemProps = {
  balanceUsd: number;
  unitsStr?: numberString;
  lastUpdated?: number;
  currentPrice?: number;
  symbol?: string | null;
  logo?: string | null; // url
  showAvatar?: boolean;
  showChainBadge?: string | null; // url
};
const BalanceItem: FunctionComponent<BalanceItemProps> = ({
  unitsStr,
  balanceUsd,
  lastUpdated,
  currentPrice,
  symbol,
  logo,
  showAvatar,
  showChainBadge,
}) => {
  const b = `${commifyNumberString(unitsStr, DISPLAY_DECIMALS)} ${symbol ?? ''}`;
  const u = dollarify(balanceUsd);
  const p = dollarify(currentPrice ?? 0);
  const t = moment(lastUpdated).local().format(DATETIME_FORMAT);
  const pt = `${p} @ ${t}`;

  const baseAvatarElement = (
    <ListItemAvatar>
      {logo ? (
        <Avatar src={logo} alt={symbol ?? ''} sx={{ height: '45px', width: '45px' }} />
      ) : (
        <Avatar sx={{ fontSize: 'small' }}>{symbol}</Avatar>
      )}
    </ListItemAvatar>
  );

  const avatarElement = showChainBadge ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<SmallAvatar alt="Remy Sharp" src={showChainBadge} />}
    >
      {baseAvatarElement}
    </Badge>
  ) : (
    baseAvatarElement
  );

  return balanceUsd ? (
    <Tooltip title={pt} arrow placement={'right'}>
      <ListItem sx={{ width: 'auto' }}>
        {showAvatar ? avatarElement : null}
        <ListItemText primary={b} secondary={u} />
      </ListItem>
    </Tooltip>
  ) : null;
};
export default BalanceItem;
