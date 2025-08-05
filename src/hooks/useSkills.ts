import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skill } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching skills",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData: Omit<Skill, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('skills')
        .insert([{ ...skillData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setSkills(prev => [data, ...prev]);
      
      toast({
        title: "Skill added",
        description: `${skillData.name} has been added to your skills.`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error adding skill",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setSkills(prev => prev.map(skill => skill.id === id ? data : skill));
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating skill",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSkills(prev => prev.filter(skill => skill.id !== id));
      
      toast({
        title: "Skill deleted",
        description: "The skill has been removed from your portfolio.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting skill",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    loading,
    addSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills,
  };
};