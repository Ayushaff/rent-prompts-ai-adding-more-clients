import { Dispatch, SetStateAction } from "react";

interface Option {
  id: number;
  label: string;
  description: string;
}

interface OptionSelectorProps {
  options: Option[];
  selectedOption: Option | null; // Updated type
  onOptionSelect: Dispatch<SetStateAction<Option | null>>; // Updated type
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedOption,
  onOptionSelect,
}) => {

  const handleOptionChange = (option: Option) => {
    onOptionSelect(option); // Pass the whole option object instead of just the id
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id} className="relative">
          <input
            type="radio"
            name="options"
            id={`option${option.id}-checkbox`}
            value={option.id}
            checked={selectedOption?.id === option.id}
            onChange={() => handleOptionChange(option)}
            className="hidden peer"
          />
          <label
            htmlFor={`option${option.id}-checkbox`}
            className={`relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md w-full cursor-pointer transition-all ${
              selectedOption?.id === option.id
                ? "bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6]"
                : ""
            }`}
            style={{ width: '100%' }}  // Ensure full width for the label
          >
            {/* Background Gradient */}
            <span
              className={`absolute inset-0 bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] transition-all ease-out duration-400 group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] ${
                selectedOption?.id === option.id
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            ></span>

            {/* Content */}
            <span
              className={`relative w-full px-6 py-3 transition-all ease-out rounded-md duration-400 ${
                selectedOption?.id === option.id
                  ? "bg-opacity-0"
                  : "bg-indigo-900 group-hover:bg-opacity-0"
              }`}
            >
              <div className="flex items-center space-x-5">
                <svg
                  className="w-16 h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <g fill="currentColor">
                    <path
                      d="M224 56v122.06l-39.72-39.72a8 8 0 0 0-11.31 0L147.31 164l-49.65-49.66a8 8 0 0 0-11.32 0L32 168.69V56a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8"
                      opacity="0.2"
                    />
                    <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m0 16v102.75l-26.07-26.06a16 16 0 0 0-22.63 0l-20 20l-44-44a16 16 0 0 0-22.62 0L40 149.37V56ZM40 172l52-52l80 80H40Zm176 28h-21.37l-36-36l20-20L216 181.38zm-72-100a12 12 0 1 1 12 12a12 12 0 0 1-12-12" />
                  </g>
                </svg>
                <div className="flex flex-col justify-start">
                  <div className="w-full text-lg font-semibold">
                    {option.label}
                  </div>
                  <div className="w-full text-sm opacity-60">
                    {option.description}
                  </div>
                </div>
              </div>
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default OptionSelector;
