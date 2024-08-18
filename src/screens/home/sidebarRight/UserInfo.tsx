import Avatar from "../../../components/Avatar";

interface IProps {
  name?: string;
  email?: string;
}

const UserInfo = ({ name, email }: IProps) => {
  return (
    <>
      <div className="flex justify-center">
        <Avatar width="w-24" height="h-24" name={name} />
      </div>
      <div>
        <div>
          <label htmlFor="email">Email:</label>
        </div>
        <input
          id="email"
          type="text"
          placeholder="type your email"
          defaultValue={email}
          className="border px-4 py-2 rounded-md w-full mt-2 outline-none"
        />
      </div>

      <div className="mt-8">
        <div>
          <label htmlFor="email">Name:</label>
        </div>
        <input
          id="email"
          type="text"
          placeholder="type your name"
          defaultValue={name}
          className="border px-4 py-2 rounded-md w-full mt-2 outline-none"
        />
      </div>

      <div className="mt-8">
        <button className="bg-blue-500 rounded-3xl py-3 text-white w-full">
          Update
        </button>
      </div>

      <div className="mt-8">
        <button className="bg-blue-500 rounded-3xl py-3 text-white w-full">
          Change password
        </button>
      </div>
    </>
  );
};

export default UserInfo;
