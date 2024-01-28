import React from 'react';

export const Button = ({ onClick, children, type, className }) => {
    return (
        <button 
            type={type} 
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
