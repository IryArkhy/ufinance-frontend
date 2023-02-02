import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React from 'react';

import { PageWrapper, Toolbar } from '../../components';

import { CategoriesPanel } from './CategoriesPanel';
import { PayeesPanel } from './PayeesPanel';
import { TagsPanel } from './TagsPanel';

export function SettingsView() {
  const [subPage, setSubPage] = React.useState<'categories' | 'payees' | 'tags'>('categories');

  const handleChange = (_: React.SyntheticEvent, newValue: 'categories' | 'payees' | 'tags') => {
    setSubPage(newValue);
  };

  return (
    <PageWrapper>
      <Toolbar />
      <Box width="100%" display="flex" flexDirection="column" gap={5}>
        <TabContext value={subPage}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Categories" value="categories" />
              <Tab label="Payees" value="payees" />
              <Tab label="Tags" value="tags" />
            </TabList>
          </Box>
          <TabPanel value="categories">
            <CategoriesPanel />
          </TabPanel>
          <TabPanel value="payees">
            <PayeesPanel />
          </TabPanel>
          <TabPanel value="tags">
            <TagsPanel />
          </TabPanel>
        </TabContext>
      </Box>
    </PageWrapper>
  );
}
