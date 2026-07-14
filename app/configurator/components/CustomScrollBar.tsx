export default function CustomScrollArea({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    // The "custom-scrollbar" class is the one we defined in the global CSS.
    // The "h-full" ensures it fills the height of the parent section.
    return (
        <div className={`h-full custom-scrollbar ${className} pr-4`}>
          {children}
        </div>
    );
}