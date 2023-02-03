import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/logo-no-background.svg';
import { ROUTES } from '../../lib/router';
import { resetAccountsState } from '../../redux/accounts/accountsSlice';
import { resetBalanceState } from '../../redux/balance/balanceSlice';
import { resetCategoriesState } from '../../redux/categories/categoriesSlice';
import { useDispatch } from '../../redux/hooks';
import { resetInsightsState } from '../../redux/insights/insightsSlice';
import { resetPayeesState } from '../../redux/payees/payeesSlice';
import { resetTagsState } from '../../redux/tags/tagsSlice';
import { clearUser } from '../../redux/user/userSlice';

export function NavigationSidebar() {
  const { palette } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const firstLevelItems = [
    {
      title: 'Головна',
      Icon: DashboardRoundedIcon,
      navigateTo: ROUTES.DASHBOARD,
    },
    {
      title: 'Профіль',
      Icon: AccountCircleRoundedIcon,
      navigateTo: ROUTES.USER_ACCOUNT,
    },
    {
      title: 'Рахунки',
      Icon: AccountBalanceWalletRoundedIcon,
      navigateTo: ROUTES.ACCOUNTS,
    },
    {
      title: 'Налаштування',
      Icon: SettingsSuggestRoundedIcon,
      navigateTo: ROUTES.SETTINGS,
    },
  ];

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(resetAccountsState());
    dispatch(resetBalanceState());
    dispatch(resetCategoriesState());
    dispatch(resetInsightsState());
    dispatch(resetPayeesState());
    dispatch(resetTagsState());
  };

  const secondLevelItems = [
    {
      title: 'Вийти',
      Icon: LogoutRoundedIcon,
      action: handleLogout,
    },
  ];

  if (location.pathname === ROUTES.AUTH) {
    return null;
  }

  return (
    <Drawer variant="permanent" open={true} anchor="left">
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem>
            <ListItemAvatar>
              <Logo style={{ width: 80, height: 50 }} />
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <Typography variant="overline" color={palette.grey[400]} fontWeight={600}>
              pages
            </Typography>
          </ListItem>
          {firstLevelItems.map(({ title, Icon, navigateTo }) => (
            <ListItem key={title} disablePadding sx={{ cursor: 'pointer' }}>
              <ListItemButton onClick={() => navigate(navigateTo)}>
                <ListItemIcon>
                  <Icon
                    fontSize="small"
                    sx={{
                      color: location.pathname.includes(navigateTo)
                        ? palette.secondary.light
                        : palette.grey[400],
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    color: location.pathname.includes(navigateTo)
                      ? palette.secondary.light
                      : palette.grey[400],
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ borderColor: palette.grey[700] }} />
        <List>
          {secondLevelItems.map(({ title, Icon, action }) => (
            <ListItem key={title} disablePadding sx={{ cursor: 'pointer' }}>
              <ListItemButton onClick={action}>
                <ListItemIcon>
                  <Icon
                    fontSize="small"
                    sx={{
                      color: palette.grey[400],
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    color: palette.grey[400],
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
