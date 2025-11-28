import Skeleton from "@/components/shared/Skeleton";

const ProfileSettingsSkeletons = () => {
  return (
    <div className="animate-pulse border rounded-xl p-5 shadow">
      <div className="p-5 rounded-md bg-white w-full">
        <Skeleton className="h-5" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-2/12" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Skeleton className="h-4 w-2/5 mt-4" />
            <Skeleton className="h-6 w-full mt-2" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 w-2/5 rounded mt-4" />
            <div className="h-6 bg-gray-200 w-full rounded mt-2" />
          </div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 w-2/5 rounded" />
          <div className="relative h-6 mt-2">
            <Skeleton
              className="w-5 h-5 absolute inset-0 rounded-full"
              as="div"
            />
            <Skeleton className="h-6 w-full mt-2" />
          </div>
        </div>
        <div className="mt-4">
          <div className="h-4 bg-gray-200 w-2/5 rounded" />
          <div className="relative h-6 mt-2">
            <div className="w-5 h-5 absolute inset-0 bg-gray-200 rounded-full" />
            <div className="h-6 bg-gray-200 w-full rounded mt-2" />
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
};

export const SettingsSkeletons = () => {
  return (
    <div className="border rounded-xl p-5 shadow">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 mt-1" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 mt-1" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 w-1/2 rounded" />
            <div className="h-10 bg-gray-200 rounded mt-1" />
          </div>
        </div>
        <Skeleton className="h-10 w-1/4" />
      </div>
    </div>
  );
};

export default ProfileSettingsSkeletons;
