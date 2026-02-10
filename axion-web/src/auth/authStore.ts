const TOKEN_KEY = 'axion_token';
const USER_KEY = 'axion_user';
const ADMIN_KEY = 'axion_is_admin';

export interface User {
    id: number;
    username: string;
    email: string;
}

class AuthStore {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    getUser(): User | null {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    setAuth(token: string, user: User): void {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getIsAdmin(): boolean {
        return localStorage.getItem(ADMIN_KEY) === 'true';
    }

    setIsAdmin(isAdmin: boolean): void {
        localStorage.setItem(ADMIN_KEY, isAdmin ? 'true' : 'false');
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(ADMIN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authStore = new AuthStore();
