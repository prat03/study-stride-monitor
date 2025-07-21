import { useState } from 'react';
import { SkillCard, type Skill } from './SkillCard';
import { SkillAssessment } from './SkillAssessment';
import { AddSkillDialog } from './AddSkillDialog';
import { GoalTracker, type Goal } from './GoalTracker';
import { StatsCard } from './StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Brain, 
  Users, 
  Code, 
  MessageCircle, 
  BarChart3,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SkillDashboard = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'React Development',
      category: 'Technical Skills',
      currentLevel: 3,
      targetLevel: 4,
      importance: 'Critical',
      description: 'Frontend library for building user interfaces',
      lastAssessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isImproving: true,
    },
    {
      id: '2',
      name: 'Public Speaking',
      category: 'Communication',
      currentLevel: 2,
      targetLevel: 4,
      importance: 'High',
      description: 'Presenting ideas clearly to audiences',
      lastAssessed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Team Leadership',
      category: 'Leadership',
      currentLevel: 2,
      targetLevel: 3,
      importance: 'High',
      description: 'Leading and motivating team members effectively',
    },
    {
      id: '4',
      name: 'Data Analysis',
      category: 'Technical Skills',
      currentLevel: 2,
      targetLevel: 4,
      importance: 'Medium',
      description: 'Analyzing and interpreting complex datasets',
      lastAssessed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete Advanced React Course',
      description: 'Master hooks, context, and performance optimization',
      skillId: '1',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      progress: 40,
      status: 'In Progress',
      priority: 'High',
      milestones: [
        { id: 'm1', title: 'Learn React hooks', completed: true, completedAt: new Date() },
        { id: 'm2', title: 'Build portfolio project', completed: false },
        { id: 'm3', title: 'Performance optimization', completed: false },
      ],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [assessmentSkill, setAssessmentSkill] = useState<Skill | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'goals'>('overview');
  const [selectedSkillForGoals, setSelectedSkillForGoals] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | string>('all');

  // Calculate stats
  const totalSkills = skills.length;
  const skillsAtTarget = skills.filter(s => s.currentLevel >= s.targetLevel).length;
  const avgProgress = skills.length > 0 
    ? Math.round(skills.reduce((acc, skill) => acc + (skill.currentLevel / skill.targetLevel * 100), 0) / skills.length)
    : 0;
  const criticalSkills = skills.filter(s => s.importance === 'Critical').length;
  const improvingSkills = skills.filter(s => s.isImproving).length;

  // Get unique categories
  const categories = ['all', ...new Set(skills.map(s => s.category))];

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.category === filter);

  const handleAddSkill = (skillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now().toString(),
    };
    
    setSkills(prev => [...prev, newSkill]);
    toast({
      title: "Skill Added",
      description: `${skillData.name} has been added to your skill portfolio.`,
    });
  };

  const handleAssessSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      setAssessmentSkill(skill);
      setShowAssessment(true);
    }
  };

  const handleAssessmentComplete = (skillId: string, newLevel: number, notes?: string) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { 
            ...skill, 
            currentLevel: newLevel as 1 | 2 | 3 | 4 | 5, 
            lastAssessed: new Date(),
            isImproving: newLevel > skill.currentLevel 
          }
        : skill
    ));

    const skill = skills.find(s => s.id === skillId);
    toast({
      title: "Assessment Complete!",
      description: `${skill?.name} updated to level ${newLevel}. ${notes ? 'Notes saved.' : ''}`,
    });
  };

  const handleViewGoals = (skillId: string) => {
    setSelectedSkillForGoals(skillId);
    setActiveView('goals');
  };

  const handleAddGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setGoals(prev => [...prev, newGoal]);
    toast({
      title: "Goal Created",
      description: `${goal.title} has been added to your development plan.`,
    });
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical Skills': return Code;
      case 'Leadership': return Users;
      case 'Communication': return MessageCircle;
      case 'Data Analysis': return BarChart3;
      default: return BookOpen;
    }
  };

  if (activeView === 'goals' && selectedSkillForGoals) {
    const skill = skills.find(s => s.id === selectedSkillForGoals);
    if (skill) {
      return (
        <div className="min-h-screen bg-gradient-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setActiveView('overview')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Skills
              </Button>
            </div>
            
            <GoalTracker
              skillId={selectedSkillForGoals}
              skillName={skill.name}
              goals={goals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              Skill Development Planner
            </h1>
            <p className="text-muted-foreground mt-1">
              Assess your competencies, set development goals, and track your growth
            </p>
          </div>
          <AddSkillDialog onAddSkill={handleAddSkill} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Skills"
            value={totalSkills}
            description="In your portfolio"
            icon={Target}
          />
          <StatsCard
            title="Skills at Target"
            value={skillsAtTarget}
            description={`${skillsAtTarget}/${totalSkills} achieved`}
            icon={Award}
            gradient
          />
          <StatsCard
            title="Average Progress"
            value={`${avgProgress}%`}
            description="Towards target levels"
            icon={TrendingUp}
          />
          <StatsCard
            title="Critical Skills"
            value={criticalSkills}
            description="High priority items"
            icon={Brain}
          />
        </div>

        {/* Skills Overview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Your Skills</h2>
            
            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map((category) => {
                const Icon = category === 'all' ? BookOpen : getCategoryIcon(category);
                const isActive = filter === category;
                const count = category === 'all' ? skills.length : skills.filter(s => s.category === category).length;
                
                return (
                  <Button
                    key={category}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(category)}
                    className={isActive ? "bg-gradient-professional" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category === 'all' ? 'All' : category}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Skills Grid */}
          {filteredSkills.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {filter === 'all' ? 'No skills yet' : `No ${filter} skills`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start building your skill portfolio by adding your first competency!
                </p>
                <AddSkillDialog onAddSkill={handleAddSkill} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <div 
                  key={skill.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SkillCard
                    skill={skill}
                    onAssess={handleAssessSkill}
                    onViewGoals={handleViewGoals}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Development Overview */}
        {skills.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Development Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills by Category */}
              <div className="space-y-4">
                <h4 className="font-medium">Skills by Category</h4>
                {categories.filter(c => c !== 'all').map((category) => {
                  const categorySkills = skills.filter(s => s.category === category);
                  if (categorySkills.length === 0) return null;
                  
                  const Icon = getCategoryIcon(category);
                  const avgLevel = categorySkills.reduce((acc, s) => acc + s.currentLevel, 0) / categorySkills.length;
                  const avgTarget = categorySkills.reduce((acc, s) => acc + s.targetLevel, 0) / categorySkills.length;
                  const progress = (avgLevel / avgTarget) * 100;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{category}</span>
                          <Badge variant="outline" className="text-xs">
                            {categorySkills.length} skills
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progress)}% avg progress
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assessment Dialog */}
      <SkillAssessment
        skill={assessmentSkill}
        open={showAssessment}
        onOpenChange={setShowAssessment}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
};