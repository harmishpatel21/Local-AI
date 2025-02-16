export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) => (
  <form onSubmit={onSubmit} className="flex gap-2">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="> ENTER COMMAND..."
      className="flex-1 p-2 border-2 border-electric-blue bg-void-black text-cyber-green focus:outline-none focus:glow-blue placeholder-electric-blue/50"
      disabled={isLoading}
    />
  </form>
);
