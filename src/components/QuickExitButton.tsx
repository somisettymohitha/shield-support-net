const QuickExitButton = () => {
  const handleExit = () => {
    window.open("https://www.google.com", "_self");
    window.location.replace("https://www.google.com");
  };

  return (
    <button
      onClick={handleExit}
      className="fixed top-4 right-4 z-[9999] bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Quick exit - leaves this site immediately"
    >
      ✕ Quick Exit
    </button>
  );
};

export default QuickExitButton;
