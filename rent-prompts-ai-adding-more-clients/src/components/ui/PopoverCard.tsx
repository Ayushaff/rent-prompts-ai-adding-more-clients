import { ReactNode } from "react";

interface PopupProps {
  title?: string;
  children: ReactNode;
  buttons?: ReactNode;
  onClose: () => void;
  width?: string; // Optional width prop
  logo?: ReactNode; // Optional logo prop
}

const Popup = ({
  title,
  children,
  buttons,
  onClose,
  width = "80vw",
  logo,
}: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black w-screen opacity-50"
        onClick={onClose}
      ></div>

      {/* Popup Card with animation */}
      <div
        className="relative bg-indigo-600 p-6 rounded-lg shadow-lg z-10 animate-popup"
        style={{ width }} // Set the width dynamically
      >
        <div className="flex justify-between">
          <div className="flex items-center mb-4">
            {logo && <div className="mr-2">{logo}</div>}
            <h2 className="text-xl font-bold text-primary">{title}</h2>
          </div>
          {/* Add your close icon functionality here */}
        </div>
        {children}
        <div className="mt-6 flex justify-between space-x-4">{buttons}</div>
      </div>
    </div>
  );
};

export default Popup;
