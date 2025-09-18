
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 ${className || ''}`}>
            {children}
        </div>
    );
};
