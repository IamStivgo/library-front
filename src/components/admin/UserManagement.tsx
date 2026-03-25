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
   Button,
   Chip,
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   CircularProgress,
} from '@mui/material';
import { Delete, PersonAdd } from '@mui/icons-material';
import { adminService, User, Role } from '../../services/admin.service';
import Swal from 'sweetalert2';

export const UserManagement = () => {
   const [users, setUsers] = useState<User[]>([]);
   const [roles, setRoles] = useState<Role[]>([]);
   const [loading, setLoading] = useState(false);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [openRoleDialog, setOpenRoleDialog] = useState(false);

   useEffect(() => {
      loadUsers();
      loadRoles();
   }, []);

   const loadUsers = async () => {
      setLoading(true);
      try {
         const data = await adminService.getAllUsers();
         setUsers(data);
      } catch (error: any) {
         Swal.fire('Error', 'Could not load users', 'error');
      } finally {
         setLoading(false);
      }
   };

   const loadRoles = async () => {
      try {
         const data = await adminService.getAllRoles();
         setRoles(data);
      } catch (error) {
         console.error('Error loading roles:', error);
      }
   };

   const handleDeactivate = async (userId: string) => {
      const result = await Swal.fire({
         title: 'Are you sure?',
         text: 'The user will be deactivated',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Yes, deactivate',
         cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
         try {
            await adminService.deactivateUser(userId);
            Swal.fire('Success!', 'User deactivated', 'success');
            loadUsers();
         } catch (error) {
            Swal.fire('Error', 'Could not deactivate user', 'error');
         }
      }
   };

   const handleActivate = async (userId: string) => {
      try {
         await adminService.activateUser(userId);
         Swal.fire('Success!', 'User activated', 'success');
         loadUsers();
      } catch (error) {
         Swal.fire('Error', 'Could not activate user', 'error');
      }
   };

   const handleOpenRoleDialog = (user: User) => {
      setSelectedUser(user);
      setOpenRoleDialog(true);
   };

   const handleAssignRole = async (roleId: string) => {
      if (!selectedUser) return;

      try {
         await adminService.assignRole(selectedUser.id, roleId);
         Swal.fire('Success!', 'Role assigned successfully', 'success');
         setOpenRoleDialog(false);
         loadUsers();
      } catch (error) {
         Swal.fire('Error', 'Could not assign role', 'error');
      }
   };

   if (loading) {
      return (
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
         </Box>
      );
   }

   return (
      <Box sx={{ p: 3 }}>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">User Management</Typography>
         </Box>

         <TableContainer component={Paper}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Email</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Roles</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Last Access</TableCell>
                     <TableCell align="center">Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {users.map((user) => (
                     <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.fullName || user.username || '-'}</TableCell>
                        <TableCell>
                           {user.roles.map((role) => (
                              <Chip key={role} label={role} size="small" sx={{ mr: 0.5 }} />
                           ))}
                        </TableCell>
                        <TableCell>
                           <Chip
                              label={user.isActive ? 'Active' : 'Inactive'}
                              color={user.isActive ? 'success' : 'error'}
                              size="small"
                           />
                        </TableCell>
                        <TableCell>
                           {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </TableCell>
                        <TableCell align="center">
                           <IconButton size="small" color="primary" onClick={() => handleOpenRoleDialog(user)}>
                              <PersonAdd />
                           </IconButton>
                           {user.isActive ? (
                              <IconButton size="small" color="error" onClick={() => handleDeactivate(user.id)}>
                                 <Delete />
                              </IconButton>
                           ) : (
                              <Button size="small" onClick={() => handleActivate(user.id)}>
                                 Activate
                              </Button>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)}>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogContent>
               <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Select Role</InputLabel>
                  <Select label="Select Role" onChange={(e) => handleAssignRole(e.target.value as string)}>
                     {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                           {role.name} - {role.description}
                        </MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
};
