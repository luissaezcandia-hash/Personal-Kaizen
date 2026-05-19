interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', onClick, ...props }: CardProps) => (
  <div
    onClick={onClick}
    className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);
