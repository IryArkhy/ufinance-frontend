/* eslint-disable @typescript-eslint/no-empty-function */
import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import React from 'react';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import Deposit from '../../assets/deposit.png';
import MoneyBag from '../../assets/money-bag.png';
import Withdrawal from '../../assets/withdrawal.png';
import { PageWrapper, Toolbar } from '../../components';
import { Account } from '../../lib/api/accounts';
import { Transaction } from '../../lib/api/transactions';
import { ROUTES } from '../../lib/router';
import { getTransactionAmountData } from '../../lib/transactions';
import { useDispatch, useSelector } from '../../redux/hooks';
import { getOverview, getRecentTransactions, getStatistics } from '../../redux/insights/selectors';
import {
  fetchCurrentMonthTransactions,
  fetchOverview,
  fetchStatistics,
} from '../../redux/insights/thunks';
import { ACCOUNT_ICONS } from '../Accounts/utils';

import { InsightsCard } from './components';

export function DashboardView() {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const overview = useSelector(getOverview);
  const statistics = useSelector(getStatistics);
  const transactions = useSelector(getRecentTransactions);
  const navigate = useNavigate();

  const loadInsights = async () => {
    try {
      await Promise.all([
        dispatch(fetchOverview()),
        dispatch(fetchStatistics()),
        dispatch(fetchCurrentMonthTransactions()),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loadInsights();
  }, []);

  const handleNavigateToAccounts = () => navigate(ROUTES.ACCOUNTS);

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
    yaxis: {
      title: {
        text: 'Balance, $',
      },
    },
    xaxis: {
      categories: statistics.data ? statistics.data.balanceData.date : [],
      type: 'datetime',
      title: {
        text: 'Date',
        offsetY: 70,
      },
    },
  };

  const chartSeries = [
    {
      name: 'Balance change',
      data: statistics.data ? statistics.data.balanceData.balance : [],
    },
  ];

  const donutChartSeries = statistics.data
    ? Object.values(statistics.data.transactionsByCategoryData)
    : [];

  const donutChartOptions = {
    labels: statistics.data ? Object.keys(statistics.data.transactionsByCategoryData) : [],
  };

  // const transactions = [
  //   {
  //     id: 1,
  //     payee: 'Starbucks',
  //     date: format(new Date(), 'dd MMMM yyyy'),
  //     category: 'coffee',
  //     price: 100,
  //   },
  //   {
  //     id: 2,
  //     payee: 'Aroma Kava',
  //     date: format(new Date(), 'dd MMMM yyyy'),
  //     category: 'coffee',
  //     price: 20,
  //   },
  //   {
  //     id: 3,
  //     payee: 'Yellow coffee',
  //     date: format(new Date(), 'dd MMMM yyyy'),
  //     category: 'coffee',
  //     price: 788,
  //   },
  //   {
  //     id: 4,
  //     payee: 'Silpo',
  //     date: format(new Date(), 'dd MMMM yyyy'),
  //     category: 'groceries',
  //     price: 2037,
  //   },
  //   {
  //     id: 5,
  //     payee: 'Zara',
  //     date: format(new Date(), 'dd MMMM yyyy'),
  //     category: 'shopping',
  //     price: 1000,
  //   },
  // ];

  const rows: GridRowsProp =
    transactions.data?.transactions.map((t) => ({
      id: t.id,
      date: format(new Date(t.date), 'dd MMMM yyyy, HH:mm'),
      amount: t,
      account: t.fromAccount,
      category: t.category?.name,
      type: t.type,
    })) ?? [];

  const columns: GridColDef[] = [
    {
      field: 'account',
      headerName: 'Account',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
      renderCell: ({ value }: GridRenderCellParams<Account>) => {
        const { Icon, color } = ACCOUNT_ICONS[value?.icon || 'BANK'];
        return (
          <Box display="flex" gap={2} alignItems="center">
            <Icon sx={{ color }} />
            <Typography variant="body2">{value?.name ?? 'Account'}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
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
      field: 'amount',
      headerName: 'Price',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
      align: 'center',
      renderCell: ({ value }: GridRenderCellParams<Transaction>) => {
        const amountData = getTransactionAmountData(value!);
        return (
          <Typography variant="body2" fontWeight={600} color={amountData.color}>
            {amountData.sign}
            {amountData.amount}
          </Typography>
        );
      },
    },
  ];

  return (
    <PageWrapper>
      <Toolbar />

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" fontWeight={600}>
          Overview this months
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddRounded fontSize="small" />}>
          Додати транзакцію
        </Button>
      </Box>

      <Box display="flex" gap={5} alignItems="center" mb={5}>
        {overview.loading === 'pending' ? (
          <CircularProgress />
        ) : (
          <>
            <Box flex={1}>
              <InsightsCard
                imgSrc={Deposit}
                title="Total Income"
                indicator={`${Math.round(
                  overview.data?.totalExpensesAndEarnings.earningsInUah ?? 0,
                ).toLocaleString()} ₴`}
                buttonLabelEntity="transactions"
                onButtonClick={handleNavigateToAccounts}
              />
            </Box>
            <Box flex={1}>
              <InsightsCard
                imgSrc={Withdrawal}
                title="Total expences"
                indicator={`${Math.round(
                  overview.data?.totalExpensesAndEarnings.expensesInUah ?? 0,
                ).toLocaleString()} ₴`}
                buttonLabelEntity="transactions"
                onButtonClick={handleNavigateToAccounts}
              />
            </Box>
            <Box flex={1}>
              <InsightsCard
                imgSrc={MoneyBag}
                title="Transactions"
                indicator={(overview.data?.transactionsCount ?? 0).toString()}
                buttonLabelEntity="transcations"
                onButtonClick={handleNavigateToAccounts}
              />
            </Box>
          </>
        )}
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

            {statistics.loading === 'pending' ? (
              <CircularProgress />
            ) : (
              <Chart options={chartOption} series={chartSeries} type="line" width="100%" />
            )}
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

            {statistics.loading === 'pending' ? (
              <CircularProgress />
            ) : (
              <Chart options={donutChartOptions} series={donutChartSeries} type="pie" width="95%" />
            )}
          </CardContent>
        </Card>
      </Box>
      <Box>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={<Typography variant="h6">Transactions History</Typography>}
            subheader={
              <Typography variant="body2" color="GrayText">
                The most recent transactions
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
            <Button
              variant="text"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={handleNavigateToAccounts}
            >
              See more
            </Button>
          </Box>
        </Card>
      </Box>
    </PageWrapper>
  );
}
