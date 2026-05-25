/**
 * FormField — dark-theme label + input/select wrapper for admin forms.
 * Keeps the admin panel's consistent styling in one place.
 */
export default function FormField({ label, children }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                {label}
            </label>
            {children}
        </div>
    );
}
