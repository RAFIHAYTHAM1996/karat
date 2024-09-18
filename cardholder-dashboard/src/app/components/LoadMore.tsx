export const LoadMore = ({
  action,
  disabled = false,
}: {
  action: () => any;
  disabled?: boolean;
}) => {
  return (
    !disabled && (
      <button
        className="rounded-full border-transparent transition-colors bg-foreground text-background gap-2 hover:text-[#ffffff] hover:bg-[#4e3bf7] my-10 dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={action}
      >
        Load More
      </button>
    )
  );
};
