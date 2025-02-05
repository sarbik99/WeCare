import { useState } from "react";

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {children}
        <button onClick={() => onOpenChange(false)} className="mt-4 bg-red-500 text-white p-1 rounded active:scale-90">
          Close
        </button>
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="text-xl font-bold mb-2">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4">{children}</div>;
}
