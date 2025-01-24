
interface ScreenLoaderProps {
  isLoading?: boolean;
}

export const ScreenLoader = ({ isLoading }: ScreenLoaderProps) => {
  return (
    <div>
      {
        isLoading && <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black/80 z-9999 min-h-screen min-w-screen">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-t-transparent mx-auto border-blue-700" />
        </div>
      }
    </div>
  )
};
