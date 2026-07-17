import styles from './SearchInput.module.css';

export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className={styles.wrap}>
      <i className="ti ti-search" />
      <input
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
