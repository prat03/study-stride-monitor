import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...courseData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => [data, ...prev]);
      
      toast({
        title: "Course added",
        description: `${courseData.title} has been added to your courses.`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error adding course",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCourses(prev => prev.map(course => course.id === id ? data : course));
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating course",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCourses(prev => prev.filter(course => course.id !== id));
      
      toast({
        title: "Course deleted",
        description: "The course has been removed from your library.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting course",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    refetch: fetchCourses,
  };
};