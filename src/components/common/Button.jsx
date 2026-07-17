import styles from './Button.module.css';

export default function Button({ children, variant = 'primary', icon, onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`ti ${icon}`} />}
      {children}
    </button>
  );
}
