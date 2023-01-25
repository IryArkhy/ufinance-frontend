import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '../../lib/router';

export function NavigationSidebar() {
  const { palette } = useTheme();
  const location = useLocation();

  const firstLevelItems = [
    {
      title: 'Профіль',
      Icon: AccountCircleRoundedIcon,
      navigateTo: '/',
    },
    {
      title: 'Рахунки',
      Icon: AccountBalanceWalletRoundedIcon,
      navigateTo: '/',
    },
    {
      title: 'Налаштування',
      Icon: SettingsSuggestRoundedIcon,
      navigateTo: '/',
    },
    {
      title: 'Допомога',
      Icon: InfoRoundedIcon,
      navigateTo: '/',
    },
  ];

  const secondLevelItems = [
    {
      title: 'Вийти',
      Icon: LogoutRoundedIcon,
      navigateTo: '/',
    },
  ];

  if (location.pathname === ROUTES.AUTH) {
    return null;
  }

  return (
    <Drawer variant="permanent" open={true} anchor="left">
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {firstLevelItems.map(({ title, Icon }) => (
            <ListItem key={title} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon
                    fontSize="small"
                    sx={{
                      color: palette.getContrastText(palette.primary.main),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    color: palette.getContrastText(palette.primary.main),
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {secondLevelItems.map(({ title, Icon }) => (
            <ListItem key={title} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon
                    fontSize="small"
                    sx={{
                      color: palette.getContrastText(palette.primary.main),
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={title}
                  sx={{
                    color: palette.getContrastText(palette.primary.main),
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
