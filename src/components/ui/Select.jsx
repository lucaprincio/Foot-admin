// Select générique avec label
export default function Select({ label, id, options, ...props }) {
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
      <select
        id={id}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white
                   focus:outline-none focus:ring-2 focus:ring-green-500"
        {...props}
      >
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </div>
  );
}
