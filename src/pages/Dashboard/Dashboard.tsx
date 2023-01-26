/* eslint-disable @typescript-eslint/no-empty-function */
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import Chart from 'react-apexcharts';

import Deposit from '../../assets/deposit.png';
import MoneyBag from '../../assets/money-bag.png';
import UkrFlag from '../../assets/ukraine.png';
import Withdrawal from '../../assets/withdrawal.png';
import { stringAvatar } from '../../lib/avatar';
import { useSelector } from '../../redux/hooks';
import { getUser } from '../../redux/user/selectors';

import { InsightsCard } from './components';

export function Dashboard() {
  const user = useSelector(getUser);
  const { palette } = useTheme();

  const avatarProps = stringAvatar(user!.username);

  const chartOption: ApexOptions = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        tools: {
          selection: false,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: false,
          download: false,
        },
      },
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

  const chartSeries = [
    {
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];

  const donutChartSeries = [44, 55, 13, 33];
  const donutChartOptions = {
    labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
  };

  const balance = 10000;

  const transactions = [
    {
      id: 1,
      payee: 'Starbucks',
      date: format(new Date(), 'dd MMMM yyyy'),
      category: 'coffee',
      price: 100,
    },
    {
      id: 2,
      payee: 'Aroma Kava',
      date: format(new Date(), 'dd MMMM yyyy'),
      category: 'coffee',
      price: 20,
    },
    {
      id: 3,
      payee: 'Yellow coffee',
      date: format(new Date(), 'dd MMMM yyyy'),
      category: 'coffee',
      price: 788,
    },
    {
      id: 4,
      payee: 'Silpo',
      date: format(new Date(), 'dd MMMM yyyy'),
      category: 'groceries',
      price: 2037,
    },
    {
      id: 5,
      payee: 'Zara',
      date: format(new Date(), 'dd MMMM yyyy'),
      category: 'shopping',
      price: 1000,
    },
  ];

  const rows: GridRowsProp = transactions;

  const columns: GridColDef[] = [
    {
      field: 'payee',
      headerName: 'Payee',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600}>
          {value}
        </Typography>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: { sm: `calc(100% - ${250}px)` },
        ml: { sm: `${250}px` },
        px: 5,
        pb: 5,
      }}
    >
      <Box mb={5} display="flex" justifyContent="flex-end" py={2}>
        <Box display="flex" alignItems="center" gap={3}>
          <img src={UkrFlag} style={{ width: '30px' }} />
          <Tooltip title="Total balance">
            <Typography
              variant="body2"
              fontWeight="600"
              color={balance > 0 ? palette.success.light : palette.error.main}
            >
              {balance} UAH
            </Typography>
          </Tooltip>
          <Box p="3px" border={`1px solid ${palette.grey[200]}`} borderRadius="50%">
            <Avatar sx={{ ...avatarProps.sx, width: 35, height: 35 }}>
              {avatarProps.children}
            </Avatar>
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" fontWeight={600}>
          Overview this months
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddRounded fontSize="small" />}>
          Додати транзакцію
        </Button>
      </Box>

      <Box display="flex" gap={5} alignItems="center" mb={5}>
        <Box flex={1}>
          <InsightsCard
            imgSrc={Deposit}
            title="Total Income"
            indicator="30 000 ₴"
            buttonLabelEntity="transactions"
            onButtonClick={() => {}}
          />
        </Box>
        <Box flex={1}>
          <InsightsCard
            imgSrc={Withdrawal}
            title="Total expences"
            indicator="23 134 ₴"
            buttonLabelEntity="transactions"
            onButtonClick={() => {}}
          />
        </Box>
        <Box flex={1}>
          <InsightsCard
            imgSrc={MoneyBag}
            title="Total savings"
            indicator="100 000 ₴"
            buttonLabelEntity="savings"
            onButtonClick={() => {}}
          />
        </Box>
      </Box>
      <Box display="flex" gap={5} alignItems="center" mb={5}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <CardHeader
              title={<Typography variant="h6">Balance change</Typography>}
              subheader={
                <Typography variant="body2" color="GrayText">
                  Based on the last 30 days
                </Typography>
              }
            />

            <Chart options={chartOption} series={chartSeries} type="line" width="100%" />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <CardHeader
              title={<Typography variant="h6">Spendings by category</Typography>}
              subheader={
                <Typography variant="body2" color="GrayText">
                  Based on the last 30 days
                </Typography>
              }
            />

            <Chart options={donutChartOptions} series={donutChartSeries} type="pie" width="95%" />
          </CardContent>
        </Card>
      </Box>
      <Box>
        {/* <Box display="flex" gap={2} alignItems="center" mb={3}>
          <Typography variant="h6">Transactions History</Typography>
          <Tooltip title="Last 7 days" color="action">
            <InfoRounded />
          </Tooltip>
        </Box> */}
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={<Typography variant="h6">Transactions History</Typography>}
            subheader={
              <Typography variant="body2" color="GrayText">
                Based on the last 30 days
              </Typography>
            }
          />
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            onRowClick={() => {}}
            loading={false}
            hideFooter
            sx={{
              border: 'hidden',
              borderRadius: 0,
              '& .lastTransactionsTableHeader': {
                bgcolor: palette.grey[200],
              },
              '& .MuiDataGrid-columnHeaders': {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
              '& .MuiDataGrid-cell:focus, .MuiDataGrid-cell:focus-within, .MuiDataGrid-columnHeader:focus-within':
                {
                  outline: 'none',
                },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
            }}
          />
          <Divider />
          <Box p={1}>
            <Button variant="text" endIcon={<ArrowForwardRoundedIcon />} onClick={() => {}}>
              See more
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
