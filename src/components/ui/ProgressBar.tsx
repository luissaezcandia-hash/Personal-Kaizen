export const ProgressBar = ({ value }: { value: number }) => (
  <div className="relative w-full h-4 overflow-hidden rounded-full bg-secondary">
    <div
      className="h-full bg-primary transition-all duration-500 ease-in-out"
      style={{ width: `${value}%` }}
    />
  </div>
);
