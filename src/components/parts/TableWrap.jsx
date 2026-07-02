export default function TableWrap({ children, className = '' }) {
  return (
    <div className={`table-wrap ${className}`}>
      <table>{children}</table>
    </div>
  );
}
