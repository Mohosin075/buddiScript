import Stories from "./Stories";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
const Feed = () => {
  return (
    <div className="max-w-5xl mx-auto md:p-6">
      {/* Your Story Header */}
      {/* Story Section */}
      <Stories />

      {/* Create Post Card */}
      <CreatePost />

      {/* Post Card */}
      <PostCard />
    </div>
  );
};

export default Feed;
