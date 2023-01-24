export const ROUTES = {
  BASE: '/',
  LOGIN: '/login',
  SIGN_UP: '/signup',
  DASHBOARD: '/dashboard',
  TRANSACTION: {
    INDEX: '/transactions/:id',
    createPath: function createPath(id: string): string {
      return this.INDEX.replace(':id', id);
    },
  },
  USER_ACCOUNT: '/profile',
};
