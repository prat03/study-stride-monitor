import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, TrendingUp, Play, Edit3 } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  totalHours: number;
  studiedHours: number;
  category: string;
  lastStudied?: Date;
  isActive?: boolean;
}

interface CourseCardProps {
  course: Course;
  onStartStudy?: (courseId: string) => void;
  onEdit?: (course: Course) => void;
}

export const CourseCard = ({ course, onStartStudy, onEdit }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-gradient-success';
    if (progress >= 50) return 'bg-gradient-primary';
    return 'bg-primary';
  };

  const formatLastStudied = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className="shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          </div>
          <div className="flex gap-1 ml-2">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            {course.isActive && (
              <Badge className="bg-gradient-primary text-xs">
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={course.progress} 
              className="h-2"
            />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ${getProgressColor(course.progress)}`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{course.studiedHours}h / {course.totalHours}h</div>
              <div className="text-xs text-muted-foreground">Study Time</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{formatLastStudied(course.lastStudied)}</div>
              <div className="text-xs text-muted-foreground">Last Studied</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onStartStudy?.(course.id)}
            className="flex-1 bg-gradient-primary hover:shadow-glow"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
          <Button 
            onClick={() => onEdit?.(course)}
            variant="outline"
            size="sm"
            className="hover:bg-muted"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};