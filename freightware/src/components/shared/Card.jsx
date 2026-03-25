export default function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div
      className={`bg-fw-surface border border-fw-border rounded-lg p-6 ${
        glow ? 'shadow-[0_0_20px_rgba(6,182,212,0.08)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
