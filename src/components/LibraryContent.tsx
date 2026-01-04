import { BookOpen, Clock, Star, Play, Bookmark, TrendingUp } from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  duration: string;
  rating: number;
  category: string;
}

const courses: Course[] = [
  {
    id: "rfscVS0vtbw",
    title: "Learn Python - Full Course",
    instructor: "freeCodeCamp",
    thumbnail: "https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg",
    progress: 65,
    duration: "4h 26m",
    rating: 4.9,
    category: "Programming",
  },
  {
    id: "8hly31xKli0",
    title: "Algorithms & Data Structures",
    instructor: "Tech Academy",
    thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/mqdefault.jpg",
    progress: 30,
    duration: "5h 22m",
    rating: 4.8,
    category: "Computer Science",
  },
  {
    id: "vLnPwxZdW4Y",
    title: "C++ Full Course",
    instructor: "Programming Hub",
    thumbnail: "https://i.ytimg.com/vi/vLnPwxZdW4Y/mqdefault.jpg",
    progress: 10,
    duration: "4h 01m",
    rating: 4.7,
    category: "Programming",
  },
  {
    id: "PkZNo7MFNFg",
    title: "JavaScript Tutorial",
    instructor: "Web Dev Pro",
    thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg",
    progress: 0,
    duration: "3h 30m",
    rating: 4.9,
    category: "Web Development",
  },
  {
    id: "Oe421EPjeBE",
    title: "Node.js & Express",
    instructor: "Backend Masters",
    thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/mqdefault.jpg",
    progress: 0,
    duration: "8h 16m",
    rating: 4.8,
    category: "Backend",
  },
  {
    id: "w7ejDZ8SWv8",
    title: "React JS Course",
    instructor: "React Academy",
    thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg",
    progress: 0,
    duration: "11h 55m",
    rating: 4.9,
    category: "Frontend",
  },
];

interface LibraryContentProps {
  onVideoClick: (id: string) => void;
}

export const LibraryContent = ({ onVideoClick }: LibraryContentProps) => {
  const inProgress = courses.filter((c) => c.progress > 0);
  const saved = courses.filter((c) => c.progress === 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-primary" />
          My Library
        </h2>
        <span className="text-sm text-muted-foreground">{courses.length} courses</span>
      </div>

      {/* Continue Learning */}
      {inProgress.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Continue Learning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map((course, i) => (
              <div
                key={course.id}
                onClick={() => onVideoClick(course.id)}
                className="glass rounded-2xl p-4 cursor-pointer card-hover opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-4">
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                      <Star className="w-3 h-3 text-amber-500 ml-2" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{course.progress}% complete</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Courses */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-primary" />
          Saved for Later
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((course, i) => (
            <div
              key={course.id}
              onClick={() => onVideoClick(course.id)}
              className="glass rounded-2xl overflow-hidden cursor-pointer card-hover opacity-0 animate-fade-in"
              style={{ animationDelay: `${(i + inProgress.length) * 100}ms` }}
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-10 h-10 text-white" fill="white" />
                </div>
                <span className="absolute top-2 right-2 px-2 py-1 bg-foreground/80 text-white text-xs rounded-lg">
                  {course.duration}
                </span>
              </div>
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{course.category}</span>
                <h4 className="font-semibold text-foreground mt-1 truncate">{course.title}</h4>
                <p className="text-sm text-muted-foreground">{course.instructor}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                  <span className="text-sm font-medium text-foreground">{course.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
