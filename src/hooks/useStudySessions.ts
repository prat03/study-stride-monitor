import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StudySession } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useStudySessions = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudySessions = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudySessions(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching study sessions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStudySession = async (sessionData: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{ ...sessionData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setStudySessions(prev => [data, ...prev]);
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error saving study session",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStudySession = async (id: string, updates: Partial<StudySession>) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setStudySessions(prev => prev.map(session => session.id === id ? data : session));
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating study session",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchStudySessions();
  }, []);

  return {
    studySessions,
    loading,
    addStudySession,
    updateStudySession,
    refetch: fetchStudySessions,
  };
};