import { useState, InputHTMLAttributes } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './PasswordInput.module.css';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const PasswordInput = ({ label, className, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={styles.field}>
            {label && <label htmlFor={props.id}>{label}</label>}
            <div className={styles.passwordField}>
                <input
                    {...props}
                    type={showPassword ? "text" : "password"}
                    className={className}
                />
                <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={props.disabled}
                    tabIndex={-1}
                >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
            </div>
        </div>
    );
};
