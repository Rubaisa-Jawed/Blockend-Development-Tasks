// components/card.js
export function Card({ children }) {
    return <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">{children}</div>;
}

export function CardHeader({ children }) {
    return <div className="border-b p-4">{children}</div>;
}

export function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
}

export function CardFooter({ children }) {
    return <div className="border-t p-4">{children}</div>;
}

export function CardTitle({ children }) {
    return <h3 className="text-lg font-semibold">{children}</h3>;
}