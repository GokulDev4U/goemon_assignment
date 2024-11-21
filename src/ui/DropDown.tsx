import { useState } from "react";

interface DropdownProps<T> {
  options: T[]; // Array of options
  value: T | null; // Currently selected value
  onChange: (value: T) => void; // Callback when value changes
  placeholder?: string; // Placeholder text
  className?: string; // Additional CSS classes
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {value || <span className="text-gray-500">{placeholder}</span>}
        <span className="absolute right-2 top-2 text-gray-600">&#x25BC;</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
