import { DeleteRounded } from '@mui/icons-material';
import InfoRounded from '@mui/icons-material/InfoRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '../../redux/hooks';
import { getTags } from '../../redux/tags/selectors';
import { createNewTags, fetchTags, removeTag } from '../../redux/tags/thunks';

export function TagsPanel() {
  const { palette } = useTheme();
  const { tags, loading } = useSelector(getTags);
  const dispatch = useDispatch();
  const [tagsNames, setTagsNames] = React.useState<string[]>([]);

  const loadTags = async () => {
    await dispatch(fetchTags());
  };

  React.useEffect(() => {
    loadTags().catch(console.log);
  }, []);

  if (loading && !tags) {
    return <CircularProgress />;
  }

  const handleDelete = async (id: string) => {
    await dispatch(removeTag(id));
  };

  const handleCreate = async () => {
    await dispatch(createNewTags(tagsNames));
    setTagsNames([]);
  };

  const rows: GridRowsProp = tags.map((c) => ({ ...c, action: c.id }));

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Назва',
      flex: 1,
      headerClassName: 'lastTableHeader',
    },
    {
      field: 'action',
      headerName: '',
      headerClassName: 'lastTableHeader',
      renderCell: ({ value }) => (
        <Box width="100%" display="flex" justifyContent="flex-end">
          <IconButton onClick={() => handleDelete(value)}>
            <DeleteRounded />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Створення теґів</Typography>
              <Tooltip title="Натисніть клавішу Enter, щоб додати категорію до списку">
                <InfoRounded color="action" fontSize="small" />
              </Tooltip>
            </Box>
          }
          subheader={
            <Typography variant="body2" color="GrayText">
              Додайте кілька теґів одночасно
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between' }}>
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                multiple
                freeSolo
                value={tagsNames}
                options={[]}
                onChange={(_e, nextValue) => setTagsNames(nextValue)}
                renderTags={(value, getTagProps) =>
                  value.map((category, index: number) => (
                    <Chip
                      variant="outlined"
                      label={category}
                      {...getTagProps({ index })}
                      key={category}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="Теґи" />}
              />
            </FormControl>
            <LoadingButton
              sx={{ width: '20%' }}
              variant="contained"
              disabled={tagsNames.length === 0}
              loading={loading === 'pending'}
              onClick={handleCreate}
            >
              Створити
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={<Typography variant="h6">Теґи</Typography>}
          subheader={
            <Typography variant="body2" color="GrayText">
              Керування списком теґів
            </Typography>
          }
        />
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          loading={false}
          hideFooter
          sx={{
            border: 'hidden',
            borderRadius: 0,
            '& .lastTableHeader': {
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
      </Card>
    </Box>
  );
}
