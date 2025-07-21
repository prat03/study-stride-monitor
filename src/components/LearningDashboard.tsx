import { useState, useEffect } from 'react';
import { CourseCard, type Course } from './CourseCard';
import { StudyTimer } from './StudyTimer';
import { AddCourseDialog } from './AddCourseDialog';
import { StatsCard } from './StatsCard';
import { BookOpen, Clock, Target, TrendingUp, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudySession {
  id: string;
  courseId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

export const LearningDashboard = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React including components, state, and props',
      progress: 65,
      totalHours: 40,
      studiedHours: 26,
      category: 'Programming',
      lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: '2',
      title: 'UI/UX Design Principles',
      description: 'Master the fundamentals of user interface and user experience design',
      progress: 30,
      totalHours: 25,
      studiedHours: 8,
      category: 'Design',
      lastStudied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Spanish Conversation',
      description: 'Practice conversational Spanish with native speakers',
      progress: 85,
      totalHours: 30,
      studiedHours: 25,
      category: 'Language',
      lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [activeStudyCourse, setActiveStudyCourse] = useState<string | null>(null);

  // Calculate stats
  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.progress >= 100).length;
  const totalStudyHours = studySessions.reduce((acc, session) => acc + session.duration, 0) / 60;
  const averageProgress = totalCourses > 0 
    ? Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / totalCourses)
    : 0;

  // Get today's study time
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayStudyTime = studySessions
    .filter(session => session.startTime >= todayStart)
    .reduce((acc, session) => acc + session.duration, 0);

  const handleAddCourse = (courseData: Omit<Course, 'id' | 'progress' | 'studiedHours'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      progress: 0,
      studiedHours: 0,
    };
    
    setCourses(prev => [...prev, newCourse]);
    toast({
      title: "Course Added",
      description: `${courseData.title} has been added to your learning tracker.`,
    });
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    toast({
      title: "Course Updated",
      description: `${updatedCourse.title} has been updated.`,
    });
  };

  const handleStartStudy = (courseId: string) => {
    setActiveStudyCourse(courseId);
    const course = courses.find(c => c.id === courseId);
    toast({
      title: "Study Session Started",
      description: `Started studying ${course?.title}. Good luck!`,
    });
  };

  const handleSessionComplete = (session: StudySession) => {
    setStudySessions(prev => [...prev, session]);
    setActiveStudyCourse(null);
    
    // Update course study hours and last studied
    setCourses(prev => prev.map(course => {
      if (course.id === session.courseId) {
        const newStudiedHours = course.studiedHours + (session.duration / 60);
        const newProgress = Math.min(100, Math.round((newStudiedHours / course.totalHours) * 100));
        
        return {
          ...course,
          studiedHours: newStudiedHours,
          progress: newProgress,
          lastStudied: new Date(),
        };
      }
      return course;
    }));

    const course = courses.find(c => c.id === session.courseId);
    toast({
      title: "Session Completed!",
      description: `Great job! You studied ${course?.title} for ${session.duration} minutes.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              Study Stride Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your learning progress and build consistent study habits
            </p>
          </div>
          <AddCourseDialog onAddCourse={handleAddCourse} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Courses"
            value={totalCourses}
            description="Active learning tracks"
            icon={BookOpen}
          />
          <StatsCard
            title="Today's Study Time"
            value={`${Math.floor(todayStudyTime / 60)}h ${todayStudyTime % 60}m`}
            description="Time studied today"
            icon={Clock}
            gradient
          />
          <StatsCard
            title="Average Progress"
            value={`${averageProgress}%`}
            description="Across all courses"
            icon={Target}
          />
          <StatsCard
            title="Total Study Hours"
            value={`${Math.round(totalStudyHours)}h`}
            description="Lifetime learning"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Study Timer */}
        <div className="max-w-md mx-auto">
          <StudyTimer 
            courseId={activeStudyCourse || undefined}
            onSessionComplete={handleSessionComplete}
          />
        </div>

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Your Courses</h2>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your learning journey by adding your first course!
              </p>
              <AddCourseDialog onAddCourse={handleAddCourse} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CourseCard
                    course={course}
                    onStartStudy={handleStartStudy}
                    onEdit={(course) => {
                      // This could be expanded to open an edit dialog
                      console.log('Edit course:', course);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        {studySessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Recent Study Sessions</h2>
            <div className="space-y-2">
              {studySessions.slice(-5).reverse().map((session) => {
                const course = courses.find(c => c.id === session.courseId);
                return (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-card rounded-lg shadow-soft"
                  >
                    <div>
                      <div className="font-medium">{course?.title || 'Unknown Course'}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.startTime.toLocaleDateString()} at {session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{session.duration} minutes</div>
                      <div className="text-sm text-success">Completed</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};