import Avatar from "../Avatar";

const SettingRoom = () => {
  return (
    <div className="pl-4">
      <div className="">
        <div className="m-auto w-fit my-6">
          <Avatar width="w-24" height="h-24" name="room 1" />
        </div>
        <div className="mb-4">
          <label htmlFor="room-name">Name</label>
          <input
            id="room-name"
            type="text"
            placeholder="name"
            className="border border-gray-400 w-full p-2 rounded-lg outline-none"
            defaultValue={"room of one love javascript"}
          />
        </div>

        <div>
          <label htmlFor="room-description">Description</label>
          <textarea
            id="room-description"
            placeholder="description"
            className="border border-gray-400 w-full p-2 rounded-lg outline-none"
            defaultValue={"room of one love javascript"}
          />
        </div>

        <div className="mt-2">
          <h4 className="mb-1">Private</h4>
          <label
            htmlFor="switch"
            className="relative w-[40px] h-[24px] inline-block"
          >
            <input
              title="switch"
              id="switch"
              type="checkbox"
              className="w-0 h-0 peer"
            />
            <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 transition-all peer-checked:bg-blue-500 peer-focus:shadow slider rounded-[30px]"></span>
          </label>
        </div>

        <div className="flex flex-col gap-2 items-end mt-5">
          <button className="bg-blue-500 w-[110px] py-2  text-white rounded-lg text-sm hover:bg-blue-600 active:bg-blue-700">
            update
          </button>
          <button className="bg-red-500 w-[110px] py-2 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-700">
            delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingRoom;
