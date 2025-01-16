import React from "react";

interface CardProps {
  title: string;
  value: string;
  description: string;
  icon?: any;
}

const Card: React.FC<CardProps> = ({ title, value, description, icon }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {icon && (
          <div className="text-gray-800">
            {icon}
          </div>
        )}
      </div>
      
      <p className="text-2xl font-semibold text-indigo-600">{value}</p>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </div>
  );
};

export default Card;
