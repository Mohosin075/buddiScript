import Skeleton from "@/components/shared/Skeleton";

const ProfileOverviewSkeletons = () => {
  return (
    <div className="animate-pulse border rounded-xl p-5 shadow">
      <Skeleton className="h-6 mb-3" />
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Skeleton className="w-24 h-24 rounded-full mb-3" as="div" />
            <Skeleton
              className="-bottom-2 -right-2 h-8 w-8 rounded-full absolute"
              as="div"
            />
          </div>
          <div className="mt-4">
            <Skeleton className="h-5 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="w-20 h-4 mt-2" />
          </div>
        </div>
        <Skeleton className="h-0.5 rounded-full" />
        <div className="space-y-3">
          <div className="flex items-center">
            <Skeleton className="w-full h-4 mr-3" />
            <div>
              <Skeleton className="h-3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center">
            <Skeleton className="w-full h-4 mr-3" />
            <Skeleton className="w-full h-4 mr-3" />
            <div>
              <Skeleton className="h-3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center">
            <Skeleton className="w-full h-4 mr-3" />
            <Skeleton className="w-full h-4 mr-3" />
            <div>
              <Skeleton className="h-3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center">
            <Skeleton className="w-full h-4 mr-3" />
            <Skeleton className="w-full h-4 mr-3" />
            <div>
              <Skeleton className="h-3 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full h-4 bg-gray-200 rounded mr-3" />
            <div className="w-full h-4 bg-gray-200 rounded mr-3" />
            <div>
              <div className="h-3 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewSkeletons;
