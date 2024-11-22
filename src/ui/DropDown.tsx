import { useState } from "react";

interface DropdownProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className || ""}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-800 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        {value ? (
          <span className="truncate w-11/12">{value}</span>
        ) : (
          <span className="text-gray-400 truncate w-11/12">{placeholder}</span>
        )}
        <span className="ml-2 text-gray-500">
          {isOpen ? <>&#x25B2;</> : <>&#x25BC;</>}
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-60 bg-white border border-gray-300 rounded-lg shadow-lg overflow-auto">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer transition"
            >
              <span className="block truncate">{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
