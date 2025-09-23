export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-row bg-red-400 w-2xs p-2 rounded-sm">
      <span>{message}</span>
    </div>
  );
};
