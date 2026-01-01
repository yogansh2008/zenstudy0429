interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  onClick: () => void;
}

export const VideoCard = ({ title, thumbnail, onClick }: VideoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl overflow-hidden cursor-pointer shadow-card card-hover"
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-40 object-cover"
      />
      <p className="p-4 font-semibold text-sm text-card-foreground line-clamp-2">
        {title}
      </p>
    </div>
  );
};
