import { api } from './api.service';

export interface User {
   id: string;
   email: string;
   username?: string;
   fullName?: string;
   avatarUrl?: string;
   isActive: boolean;
   emailVerified: boolean;
   roles: string[];
   permissions: string[];
   lastLogin?: string;
   createdAt: string;
}

export interface Role {
   id: string;
   name: string;
   description?: string;
   permissions: Permission[];
}

export interface Permission {
   id: string;
   name: string;
   description?: string;
   resource: string;
   action: string;
}

export interface AuditLog {
   id: string;
   userId?: string;
   userEmail?: string;
   action: string;
   resource: string;
   resourceId?: string;
   details?: any;
   ipAddress?: string;
   userAgent?: string;
   status: 'success' | 'failure' | 'warning';
   errorMessage?: string;
   createdAt: string;
}

export const adminService = {
   async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
      const response = await api.get(`/users?limit=${limit}&offset=${offset}`);
      return response.data.data;
   },

   async getUserById(userId: string): Promise<User> {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
   },

   async updateUser(userId: string, data: Partial<User>): Promise<User> {
      const response = await api.put(`/users/${userId}`, data);
      return response.data.data;
   },

   async deactivateUser(userId: string): Promise<void> {
      await api.put(`/users/${userId}`, { isActive: false });
   },

   async activateUser(userId: string): Promise<void> {
      await api.put(`/users/${userId}`, { isActive: true });
   },

   async assignRole(userId: string, roleId: string): Promise<void> {
      await api.post(`/users/${userId}/roles/${roleId}`);
   },

   async removeRole(userId: string, roleId: string): Promise<void> {
      await api.delete(`/users/${userId}/roles/${roleId}`);
   },

   async getAllRoles(): Promise<Role[]> {
      const response = await api.get('/roles');
      return response.data.data;
   },

   async getRoleById(roleId: string): Promise<Role> {
      const response = await api.get(`/roles/${roleId}`);
      return response.data.data;
   },

   async getAllPermissions(): Promise<Permission[]> {
      const response = await api.get('/permissions');
      return response.data.data;
   },

   async getAuditLogs(filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
   }): Promise<{ logs: AuditLog[]; total: number }> {
      const params = new URLSearchParams();
      if (filters) {
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) {
               params.append(key, String(value));
            }
         });
      }
      const response = await api.get(`/audit/logs?${params.toString()}`);
      return response.data.data;
   },

   async getUserAuditLogs(userId: string, limit = 50, offset = 0): Promise<{ logs: AuditLog[]; total: number }> {
      const response = await api.get(`/audit/logs/user/${userId}?limit=${limit}&offset=${offset}`);
      return response.data.data;
   },
};
