import { V2_MetaFunction } from "@remix-run/node";
import tumbleweed from '~/assets/tumbleweed.gif';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "afoures.com" },
    { name: "description", content: "🌱 Personal digital garden by Antoine Fourès." },
  ];
};

export default function Index() {
  return (
    <div className="space-y-16">
      <div>
        🌱 Personal digital garden by Antoine Fourès.
      </div>
      <div className="py-12 md:px-8 space-y-1 md:space-y-2">
        <div className="w-full h-0 pb-[46%] relative">
          <img 
            src={tumbleweed} 
            width="100%" 
            height="100%" 
            className="absolute rounded-md overflow-hidden" 
          />
        </div>
        <p className="text-center text-gray-400">
          nothing to see here... yet
        </p>
      </div>
    </div>
  );
}
