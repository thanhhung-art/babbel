interface IProps {
  avatar?: string;
  width?: string;
  height?: string;
  name?: string;
}

const Avatar = ({ avatar, width, height, name }: IProps) => {
  const generateRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-purple-500",
      "bg-gray-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      className={`min-${width} min-${height} ${width} ${height} rounded-full ${generateRandomColor()} text-white flex items-center justify-center`}
    >
      {avatar ? (
        <img src={avatar} alt="avatar" className="rounded-full" />
      ) : (
        <h4 className="text-xl">{name?.charAt(0).toUpperCase()}</h4>
      )}
    </div>
  );
};

export default Avatar;
