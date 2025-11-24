const Stories = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {/* Stories Container */}
      <div className="flex space-x-6 overflow-x-auto pb-2 hide-scrollbar">
        {/* Your Story */}
        <div className="flex flex-col items-center space-y-2 cursor-pointer">
          <div className="w-34 h-38 rounded-xl">
            <div
              className="w-full h-full rounded-xl bg-cover bg-center relative"
              style={{
                backgroundImage: `url('/images/card_ppl1.png')`,
              }}
            >
              {/* Dark overlay over entire image */}
              <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

              {/* Plus icon overlay */}
              <div>
                <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center border-2 border-accent-foreground z-10">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
                <div className="text-xs font-medium text-white absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                  Your Story
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* other story */}
        <div className="flex flex-col items-center space-y-2 cursor-pointer">
          <div className="w-34 h-38 rounded-xl">
            <div
              className="w-full h-full rounded-xl bg-cover bg-center relative"
              style={{
                backgroundImage: `url('images/card_ppl2.png')`,
              }}
            >
              {/* Dark overlay over entire image */}
              <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

              {/* Plus icon overlay */}
              <div>
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center border-2 border-background z-10">
                  <img src="/images/mini_pic.png" alt="" />
                </div>
                <div className="text-xs font-medium text-white absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                  mohosin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next */}
      </div>
    </div>
  );
};

export default Stories;
