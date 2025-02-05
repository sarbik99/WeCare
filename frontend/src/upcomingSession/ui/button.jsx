export function Button({ children, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 bg-green-900 text-white rounded hover:bg-green-500 active:scale-90 ${className}`}>
        {children}
      </button>
    );
  }
  