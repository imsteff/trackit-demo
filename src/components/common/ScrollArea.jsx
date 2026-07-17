/**
 * ScrollArea — branded scrollbar wrapper.
 * Usage:
 *   <ScrollArea className="flex-1 min-h-0">content</ScrollArea>
 *   <ScrollArea axis="x" className="w-full">content</ScrollArea>
 */
export default function ScrollArea({ children, className = '', axis = 'y' }) {
  const overflow =
    axis === 'x' ? 'overflow-x-auto overflow-y-hidden'
    : axis === 'both' ? 'overflow-auto'
    : 'overflow-y-auto overflow-x-hidden';

  return (
    <div className={`scrollbar-slim ${overflow} ${className}`}>
      {children}
    </div>
  );
}
