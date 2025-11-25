import Stories from "./Stories";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import { useGetAllPostsQuery } from "@/redux/api/postApi";

const Feed = () => {
  const {
    data: postData,
    isLoading: usersIsLoading,
  } = useGetAllPostsQuery();

  console.log("Posts Data in Feed:", postData);

  return (
    <div className="max-w-5xl mx-auto md:p-6">
      {/* Your Story Header */}
      <Stories />

      {/* Create Post Card */}
      <CreatePost />

      {/* Post Cards */}
      {usersIsLoading ? (
        <div>Loading posts...</div>
      ) : postData && postData.length > 0 ? (
        postData.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
};

export default Feed;
