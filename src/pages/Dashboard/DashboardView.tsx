import AddRounded from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React from 'react';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import Deposit from '../../assets/deposit.png';
import MoneyBag from '../../assets/money-bag.png';
import Withdrawal from '../../assets/withdrawal.png';
import { PageWrapper, Toolbar } from '../../components';
import { GridLoader } from '../../components/GridLoader';
import { Account } from '../../lib/api/accounts';
import { Transaction } from '../../lib/api/transactions';
import { ROUTES } from '../../lib/router';
import { getTransactionAmountData } from '../../lib/transactions';
import { getAccounts } from '../../redux/accounts/selectors';
import { fetchAccounts } from '../../redux/accounts/thunks';
import { useDispatch, useSelector } from '../../redux/hooks';
import { getOverview, getRecentTransactions, getStatistics } from '../../redux/insights/selectors';
import {
  fetchCurrentMonthTransactions,
  fetchOverview,
  fetchStatistics,
} from '../../redux/insights/thunks';
import { CreateTransactionModal } from '../Accounts/components/TransactionFormsModals';
import { ACCOUNT_ICONS } from '../Accounts/utils';

import { InsightsCard, OverviewLoader } from './components';
import { ChartsLoader } from './components/ChartsLoader';

export function DashboardView() {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const overview = useSelector(getOverview);
  const statistics = useSelector(getStatistics);
  const transactions = useSelector(getRecentTransactions);
  const navigate = useNavigate();
  const [isCreateTransactionModalOpen, setIsCreateTransactionModalOpen] = React.useState(false);

  const loadInsights = async () => {
    try {
      await Promise.all([
        dispatch(fetchOverview()),
        dispatch(fetchStatistics()),
        dispatch(fetchCurrentMonthTransactions()),
        dispatch(fetchAccounts()),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loadInsights();
  }, []);

  const handleNavigateToAccounts = () => navigate(ROUTES.ACCOUNTS);

  const handleCloseCreateTransactionModal = async (isCancel?: boolean) => {
    if (!isCancel) {
      await loadInsights();
    }
    setIsCreateTransactionModalOpen(false);
  };

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
        text: '????????????, $',
      },
    },
    xaxis: {
      categories: statistics.data ? statistics.data.balanceData.date : [],
      type: 'datetime',
      title: {
        text: '???????? ?? ??????',
        offsetY: 70,
      },
    },
  };

  const chartSeries = [
    {
      name: '?????????? ??????????????',
      data: statistics.data ? statistics.data.balanceData.balance : [],
    },
  ];

  const donutChartSeries = statistics.data
    ? Object.values(statistics.data.transactionsByCategoryData)
    : [];

  const donutChartOptions = {
    labels: statistics.data ? Object.keys(statistics.data.transactionsByCategoryData) : [],
  };

  const rows: GridRowsProp =
    transactions.data?.transactions.map((t) => ({
      id: t.id,
      date: format(new Date(t.date), 'dd MMMM yyyy, HH:mm', {
        locale: uk,
      }),
      amount: t,
      account: t.fromAccount,
      category: t.category?.name,
      type: t.type,
    })) ?? [];

  const columns: GridColDef[] = [
    {
      field: 'account',
      headerName: '??????????????',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
      renderCell: ({ value }: GridRenderCellParams<Account>) => {
        const { Icon, color } = ACCOUNT_ICONS[value?.icon || 'BANK'];
        return (
          <Box display="flex" gap={2} alignItems="center">
            <Icon sx={{ color }} />
            <Typography variant="body2">{value?.name ?? '??????????????'}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'date',
      headerName: '???????? ?? ??????',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
    },
    {
      field: 'category',
      headerName: '??????????????????',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
    },
    {
      field: 'amount',
      headerName: '????????',
      flex: 1,
      headerClassName: 'lastTransactionsTableHeader',
      align: 'center',
      renderCell: ({ value }: GridRenderCellParams<Transaction>) => {
        const amountData = value ? getTransactionAmountData(value) : null;
        return (
          <Typography variant="body2" fontWeight={600} color={amountData?.color ?? 'GrayText'}>
            {amountData && amountData.sign}
            {amountData ? amountData.amount : '?????????? ??????????'}
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
          ???????????????? ?????????? ?????????? ????????????
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          disabled={accounts.data.length === 0}
          onClick={() => setIsCreateTransactionModalOpen(true)}
          startIcon={<AddRounded fontSize="small" />}
        >
          ???????????? ????????????????????
        </Button>
      </Box>

      <Box display="flex" gap={5} alignItems="center" mb={5}>
        {overview.loading === 'pending' ? (
          <OverviewLoader />
        ) : (
          <>
            <Box flex={1}>
              <InsightsCard
                imgSrc={Deposit}
                title="?????????????????? ??????????????????????"
                indicator={`${Math.round(
                  overview.data?.totalExpensesAndEarnings.earningsInUah ?? 0,
                ).toLocaleString()} ???`}
                buttonLabelEntity="????????????????????"
                onButtonClick={handleNavigateToAccounts}
              />
            </Box>
            <Box flex={1}>
              <InsightsCard
                imgSrc={Withdrawal}
                title="???????????????? ??????????????"
                indicator={`${Math.round(
                  overview.data?.totalExpensesAndEarnings.expensesInUah ?? 0,
                ).toLocaleString()} ???`}
                buttonLabelEntity="????????????????????"
                onButtonClick={handleNavigateToAccounts}
              />
            </Box>
            <Box flex={1}>
              <InsightsCard
                imgSrc={MoneyBag}
                title="?????????????????? ????????????????????"
                indicator={(overview.data?.transactionsCount ?? 0).toString()}
                buttonLabelEntity="????????????????????"
                onButtonClick={handleNavigateToAccounts}
              />
            </Box>
          </>
        )}
      </Box>
      <Box display="flex" gap={5} alignItems="center" mb={5}>
        {statistics.loading === 'pending' ? (
          <ChartsLoader />
        ) : (
          <>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <CardHeader
                  title={<Typography variant="h6">?????????? ??????????????</Typography>}
                  subheader={
                    <Typography variant="body2" color="GrayText">
                      ???? ???????????? ???????????????????? ???? ???????????????? ????????????
                    </Typography>
                  }
                />

                {chartSeries[0].data.length === 0 ? (
                  <Typography color="GrayText">
                    ?????????? ??????????, ???????? ???? ?? ?????? ?????????? ???????????????????? ?? ?????????? ????????????. ???????????????? ????????????????
                    ?????? ?????????????????? ????????????????????.
                  </Typography>
                ) : (
                  <Chart options={chartOption} series={chartSeries} type="line" width="100%" />
                )}
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <CardHeader
                  title={<Typography variant="h6">?????????????? ???? ??????????????????????</Typography>}
                  subheader={
                    <Typography variant="body2" color="GrayText">
                      ???? ???????????? ???????????????????? ???? ???????????????? ????????????
                    </Typography>
                  }
                />
                {donutChartSeries.length === 0 ? (
                  <Typography color="GrayText">
                    ?????????? ??????????, ???????? ???? ?? ?????? ?????????? ???????????????????? ?? ?????????? ????????????. ???????????????? ????????????????
                    ?????? ?????????????????? ????????????????????.
                  </Typography>
                ) : (
                  <Chart
                    options={donutChartOptions}
                    series={donutChartSeries}
                    type="pie"
                    width="95%"
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
      <Box>
        <Card sx={{ width: '100%' }}>
          <CardHeader
            title={<Typography variant="h6">?????????????? ????????????????????</Typography>}
            subheader={
              <Typography variant="body2" color="GrayText">
                ?????????????????? ????????????????????
              </Typography>
            }
          />
          {transactions.loading === 'pending' ? (
            <GridLoader />
          ) : (
            <>
              <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                hideFooter
                components={{
                  NoRowsOverlay: () => (
                    <Typography variant="body2" color="GrayText" textAlign="center" mt={4}>
                      ?? ?????????????????? ???????????? ???????????????????? ???? ????????.
                    </Typography>
                  ),
                }}
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
                  ???????????????? ??????
                </Button>
              </Box>
            </>
          )}
        </Card>
      </Box>
      <Dialog
        open={isCreateTransactionModalOpen}
        onClose={() => setIsCreateTransactionModalOpen(false)}
        fullWidth
        keepMounted={false}
      >
        <CreateTransactionModal onClose={handleCloseCreateTransactionModal} />
      </Dialog>
    </PageWrapper>
  );
}
