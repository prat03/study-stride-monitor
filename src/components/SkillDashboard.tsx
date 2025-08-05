import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SkillCard } from './SkillCard';
import { SkillAssessment } from './SkillAssessment';
import { AddSkillDialog } from './AddSkillDialog';
import { GoalTracker } from './GoalTracker';
import { StatsCard } from './StatsCard';
import { useSkills } from '@/hooks/useSkills';
import { useGoals } from '@/hooks/useGoals';
import { Skill, Goal } from '@/types/database';
import { 
  Plus, 
  Filter, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Award,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SkillDashboard = () => {
  const { skills, loading: skillsLoading, addSkill, updateSkill } = useSkills();
  const { goals, loading: goalsLoading, addGoal, updateGoal } = useGoals();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [assessmentSkill, setAssessmentSkill] = useState<Skill | null>(null);
  const [viewMode, setViewMode] = useState('overview');
  const [selectedSkillForGoals, setSelectedSkillForGoals] = useState<string | null>(null);

  const handleAddSkill = async (skillData: any) => {
    await addSkill({
      name: skillData.name,
      category: skillData.category,
      current_level: skillData.currentLevel || 1,
      target_level: skillData.targetLevel || 5,
      importance: skillData.importance || 'medium',
      last_assessed: new Date().toISOString(),
    });
  };

  const handleAssessSkill = (skillId: string) => {
    setAssessmentSkill(skills.find(skill => skill.id === skillId) || null);
  };

  const handleAssessmentComplete = async (skillId: string, newLevel: number) => {
    await updateSkill(skillId, {
      current_level: newLevel,
      last_assessed: new Date().toISOString(),
    });
    setAssessmentSkill(null);
  };

  if (skillsLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading your skills...</span>
      </div>
    );
  }

  const totalSkills = skills.length;
  const skillsAtTarget = skills.filter(skill => skill.current_level >= skill.target_level).length;
  const avgProgress = skills.length > 0 
    ? Math.round(skills.reduce((sum, skill) => sum + (skill.current_level / skill.target_level * 100), 0) / skills.length)
    : 0;

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const categories = [...new Set(skills.map(skill => skill.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Skill Development</h2>
          <p className="text-muted-foreground">Track and improve your professional skills</p>
        </div>
        <AddSkillDialog onAddSkill={handleAddSkill} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Skills"
          value={totalSkills}
          icon={<Target className="w-4 h-4" />}
          trend="+2 this month"
        />
        <StatsCard
          title="At Target Level"
          value={skillsAtTarget}
          icon={<Award className="w-4 h-4" />}
          trend={`${Math.round((skillsAtTarget/totalSkills)*100)}% complete`}
        />
        <StatsCard
          title="Average Progress"
          value={`${avgProgress}%`}
          icon={<TrendingUp className="w-4 h-4" />}
          trend="+5% this week"
        />
        <StatsCard
          title="Need Attention"
          value={skills.filter(s => s.current_level < s.target_level).length}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="Focus areas"
        />
      </div>

      {filteredSkills.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No skills yet</h3>
          <p className="text-muted-foreground mb-4">Start building your skill portfolio</p>
          <AddSkillDialog onAddSkill={handleAddSkill} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={{
                ...skill,
                currentLevel: skill.current_level,
                targetLevel: skill.target_level,
                lastAssessed: skill.last_assessed ? new Date(skill.last_assessed) : undefined
              }}
              onAssess={() => handleAssessSkill(skill.id)}
              onViewGoals={() => {
                setSelectedSkillForGoals(skill.id);
                setViewMode('goals');
              }}
            />
          ))}
        </div>
      )}

      {assessmentSkill && (
        <SkillAssessment
          skill={{
            ...assessmentSkill,
            currentLevel: assessmentSkill.current_level,
            targetLevel: assessmentSkill.target_level
          }}
          onComplete={handleAssessmentComplete}
          onCancel={() => setAssessmentSkill(null)}
        />
      )}
    </div>
  );
};