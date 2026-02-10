import { ReactNode } from 'react';
import { Header } from './Header';
import styles from './Layout.module.css';

interface LayoutProps {
    children: ReactNode;
    isAdmin?: boolean;
}

export const Layout = ({ children, isAdmin = false }: LayoutProps) => {
    return (
        <div className={styles.container}>
            <Header isAdmin={isAdmin} />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};
