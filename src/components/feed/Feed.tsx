import Stories from "./Stories";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import { useGetAllPostsQuery } from "@/redux/api/postApi";

const Feed = () => {
  const {
    data: postData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllPostsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    pollingInterval: 10000 * 10, // Poll every 10s for new posts
  });

  // Memoize post list for performance
  const renderedPosts =
    postData && postData.length > 0
      ? postData.map((post) => <PostCard key={post._id} post={post} />)
      : null;

  return (
    <div className="max-w-5xl mx-auto md:p-6">
      {/* Your Story Header */}
      <Stories />

      {/* Create Post Card */}
      <CreatePost />

      {/* Post Cards */}
      {isLoading || isFetching ? (
        <div>Loading posts...</div>
      ) : isError ? (
        <div className="text-red-500">
          Error loading posts: {"Unknown error"}
        </div>
      ) : renderedPosts ? (
        renderedPosts
      ) : (
        <div>No posts found</div>
      )}

      {/* Example: Manual refresh button for concurrency */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => refetch()}
      >
        Refresh Feed
      </button>

      {/* TODO: Add pagination/infinite scroll for large feeds */}
    </div>
  );
};

export default Feed;
