export const Label = ({ htmlFor, children }) => {
    return (
        <label htmlFor={htmlFor} className="block text-gray-100 text-sm font-bold mb-2">
            {children}
        </label>
    );
};
