
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
    return (
        <div>
            <label htmlFor={props.id || label} className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <select
                id={props.id || label}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                {...props}
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};
