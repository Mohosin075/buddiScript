import HelmetTitle from "@/components/layout/HelmetTitle";
import LeftSide from "./home/LeftSide";
import RightSide from "./home/RightSide";
import PageContainer from "@/components/shared/PageContainer";
import Feed from "../components/feed/Feed";

export default function HomePage() {
  return (
    <div className="bg-muted fixed top-16 left-0 right-0 bottom-0">
      <PageContainer>
        <HelmetTitle title="Home" />

        <div className="flex h-screen pb-16">
          {/* Left Sidebar - Explore Section */}
          <div className="hidden xl:block w-0 xl:w-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* left side */}
            <LeftSide />
          </div>

          {/* Main Content - Feed Section */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* feed */}
            <Feed />
          </div>

          {/* Right Sidebar - Suggestions Section */}
          <div className="hidden xl:block w-0 xl:w-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none">
            {/* right side */}
            <RightSide />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
