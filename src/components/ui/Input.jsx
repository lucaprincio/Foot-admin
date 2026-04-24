// Input texte/number générique avec label
export default function Input({ label, id, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs text-gray-500 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        {...props}
      />
    </div>
  );
}
