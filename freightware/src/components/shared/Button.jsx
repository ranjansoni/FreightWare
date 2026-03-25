import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-fw-cyan text-fw-bg font-semibold hover:brightness-110 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
  ghost:
    'border border-fw-border text-fw-text-dim hover:border-fw-cyan hover:text-fw-cyan bg-transparent',
  danger:
    'bg-fw-red text-white font-semibold hover:brightness-110',
  success:
    'bg-fw-green text-fw-bg font-semibold hover:brightness-110',
  amber:
    'bg-fw-amber text-fw-bg font-semibold hover:brightness-110',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-md',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
