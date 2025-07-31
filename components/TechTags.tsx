// components/TechTags.tsx
const techTags = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express", "MongoDB", "Firebase", "Tailwind CSS"
];

export default function TechTags() {
  return (
    <div className="relative w-full overflow-hidden py-6 mt-10 text-white flex">
      <div className="animate-scroll flex w-max gap-6 px-4">
        {techTags.map((tag, index) => (
          <div
            key={index}
            className="min-w-max px-6 py-3 bg-transparent border border-gray-300 rounded-xl shadow hover:text-pink-500 hover:bg-fuchsia-200 transition-colors duration-200 cursor-default"
          >
            {tag}
          </div>
        ))}
      </div>

      {/* Repeat for seamless scroll */}
      <div className="animate-scroll flex w-max gap-6 px-4 top-6 left-full">
        {techTags.map((tag, index) => (
          <div
            key={`duplicate-${index}`}
            className="min-w-max px-6 py-3 bg-transparent border border-gray-300 rounded-xl shadow hover:text-pink-500 hover:bg-fuchsia-200 transition-colors duration-200 cursor-default"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
    
  );
}
