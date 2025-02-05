export function Button({ children, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 bg-lime-500 text-black rounded hover:bg-green-900 hover:text-white active:scale-90 ${className}`}>
        {children}
      </button>
    );
  }
  