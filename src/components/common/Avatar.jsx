import styles from './Avatar.module.css';

export default function Avatar({ name, size = 'sm' }) {
  if (!name) {
    return (
      <span className={`${styles.avatar} ${styles[size]} ${styles.unassigned}`}>
        <i className="ti ti-user" />
      </span>
    );
  }
  const initials = name.split(' ').slice(0, 2).map((n) => n[0]).join('');
  return <span className={`${styles.avatar} ${styles[size]} ${styles.assigned}`}>{initials}</span>;
}
