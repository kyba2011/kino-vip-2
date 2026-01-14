import { use } from "react";

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <iframe
        src={`https://ddbb.lol/?id=${id}&n=0`}
        className="w-full h-full border-0"
        allowFullScreen
        title="Movie Player"
      />
    </div>
  );
}
