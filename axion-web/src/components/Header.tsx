import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import styles from './Header.module.css';

interface HeaderProps {
    isAdmin: boolean;
}

export const Header = ({ isAdmin }: HeaderProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Axion Test</h1>
            <nav className={styles.nav}>
                <button onClick={() => navigate('/people')} className={styles.navButton}>Pessoas</button>
                <button onClick={() => navigate('/foods')} className={styles.navButton}>Comidas</button>
                <button onClick={() => navigate('/places')} className={styles.navButton}>Locais</button>
                {isAdmin && <button onClick={() => navigate('/users')} className={styles.navButton}>Usuários</button>}
                <button onClick={() => navigate('/profile')} className={styles.navButton}>Perfil</button>
                <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
            </nav>
        </header>
    );
};
