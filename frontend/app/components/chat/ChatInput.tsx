export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStop: () => void;
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
    {isLoading ? (
      <button
        type="button"
        onClick={onStop}
        className="px-4 py-2 border-2 border-hot-pink text-hot-pink hover:bg-hot-pink/20"
      >
        STOP
      </button>
    ) : (
      <button
        type="submit"
        className="px-4 py-2 border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/20"
      >
        SEND
      </button>
    )}
  </form>
);
