/**
 * AdminButton — polymorphic button for the dark admin theme.
 *
 * variant: 'primary' (cyan), 'secondary' (amber), 'ghost' (text-only), 'danger' (red tint)
 * size:    'sm' | 'md' (default)
 */
const VARIANTS = {
    primary:   'bg-cyan-500  text-black hover:bg-white shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    secondary: 'bg-amber-500 text-black hover:bg-white shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    ghost:     'text-gray-500 hover:text-white',
    danger:    'text-gray-600 hover:text-red-500',
};

const SIZES = {
    sm: 'px-3 py-1   text-[10px]',
    md: 'px-6 py-2   text-xs',
    lg: 'px-8 py-2   text-xs',
};

export default function AdminButton({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) {
    return (
        <button
            className={`font-black uppercase transition-all ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
