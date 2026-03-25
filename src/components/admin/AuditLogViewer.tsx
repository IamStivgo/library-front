import { useState, useEffect } from 'react';
import {
   Box,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
   Chip,
   CircularProgress,
   TextField,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   Grid,
   Button,
   TablePagination,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { adminService, AuditLog } from '../../services/admin.service';
import Swal from 'sweetalert2';

export const AuditLogViewer = () => {
   const [logs, setLogs] = useState<AuditLog[]>([]);
   const [loading, setLoading] = useState(false);
   const [total, setTotal] = useState(0);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(50);
   const [filters, setFilters] = useState({
      action: '',
      resource: '',
      status: '',
   });

   useEffect(() => {
      loadLogs();
   }, [page, rowsPerPage]);

   const loadLogs = async () => {
      setLoading(true);
      try {
         const data = await adminService.getAuditLogs({
            ...filters,
            limit: rowsPerPage,
            offset: page * rowsPerPage,
         });
         setLogs(data.logs);
         setTotal(data.total);
      } catch (error: any) {
         Swal.fire('Error', 'Could not load audit logs', 'error');
      } finally {
         setLoading(false);
      }
   };

   const handleSearch = () => {
      setPage(0);
      loadLogs();
   };

   const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'success':
            return 'success';
         case 'failure':
            return 'error';
         case 'warning':
            return 'warning';
         default:
            return 'default';
      }
   };

   return (
      <Box sx={{ p: 3 }}>
         <Typography variant="h4" mb={3}>
            Audit Logs
         </Typography>

         <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
               <Grid item xs={12} md={3}>
                  <TextField
                     fullWidth
                     label="Action"
                     value={filters.action}
                     onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                     size="small"
                  />
               </Grid>
               <Grid item xs={12} md={3}>
                  <TextField
                     fullWidth
                     label="Resource"
                     value={filters.resource}
                     onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
                     size="small"
                  />
               </Grid>
               <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                     <InputLabel>Status</InputLabel>
                     <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                     >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                        <MenuItem value="failure">Failure</MenuItem>
                        <MenuItem value="warning">Warning</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>
               <Grid item xs={12} md={3}>
                  <Button fullWidth variant="contained" startIcon={<Search />} onClick={handleSearch}>
                     Search
                  </Button>
               </Grid>
            </Grid>
         </Paper>

         {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
               <CircularProgress />
            </Box>
         ) : (
            <>
               <TableContainer component={Paper}>
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Date/Time</TableCell>
                           <TableCell>User</TableCell>
                           <TableCell>Action</TableCell>
                           <TableCell>Resource</TableCell>
                           <TableCell>Status</TableCell>
                           <TableCell>IP</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {logs.map((log) => (
                           <TableRow key={log.id}>
                              <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                              <TableCell>{log.userEmail || 'System'}</TableCell>
                              <TableCell>{log.action}</TableCell>
                              <TableCell>
                                 {log.resource}
                                 {log.resourceId && ` (${log.resourceId.substring(0, 8)}...)`}
                              </TableCell>
                              <TableCell>
                                 <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                              </TableCell>
                              <TableCell>{log.ipAddress || '-'}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               <TablePagination
                  component="div"
                  count={total}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Rows per page"
               />
            </>
         )}
      </Box>
   );
};
