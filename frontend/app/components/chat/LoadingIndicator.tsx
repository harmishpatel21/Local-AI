export const LoadingIndicator = () => (
  <div className="p-4 rounded-lg bg-cyber-green/20 mr-8 border-cyber-green glow-animation">
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-cyber-green animate-pulse" />
      <span className="text-cyber-green"> PROCESSING...</span>
    </div>
  </div>
);
