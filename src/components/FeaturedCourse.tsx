import { Star, Clock, Users, ArrowRight } from "lucide-react";

interface FeaturedCourseProps {
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  duration: string;
  students: string;
  onClick: () => void;
}

export const FeaturedCourse = ({ 
  title, 
  instructor, 
  thumbnail, 
  rating, 
  duration, 
  students,
  onClick 
}: FeaturedCourseProps) => {
  return (
    <div 
      className="bg-card rounded-2xl overflow-hidden shadow-elevated card-hover cursor-pointer opacity-0 animate-scale-in stagger-4"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-card-foreground">⭐ Featured</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-primary-foreground mb-1">{title}</h3>
          <p className="text-sm text-primary-foreground/80">by {instructor}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              {rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {students}
            </span>
          </div>
        </div>
        
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          Start Learning
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
