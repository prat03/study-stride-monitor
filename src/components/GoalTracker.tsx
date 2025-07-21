import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Target, Plus, Calendar as CalendarIcon, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Goal {
  id: string;
  title: string;
  description: string;
  skillId: string;
  targetDate: Date;
  progress: number; // 0-100
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High';
  milestones: Milestone[];
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface GoalTrackerProps {
  skillId: string;
  skillName: string;
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<Goal>) => void;
}

export const GoalTracker = ({ skillId, skillName, goals, onAddGoal, onUpdateGoal }: GoalTrackerProps) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: new Date(),
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    milestones: '' // Will be split into array
  });

  const skillGoals = goals.filter(goal => goal.skillId === skillId);

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'In Progress': return 'bg-skill-intermediate text-white';
      case 'Overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'High': return 'border-destructive text-destructive';
      case 'Medium': return 'border-warning text-warning';
      default: return 'border-muted-foreground text-muted-foreground';
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;

    const milestones: Milestone[] = newGoal.milestones
      .split('\n')
      .filter(m => m.trim())
      .map((title, index) => ({
        id: `milestone-${Date.now()}-${index}`,
        title: title.trim(),
        completed: false
      }));

    onAddGoal({
      title: newGoal.title,
      description: newGoal.description,
      skillId,
      targetDate: newGoal.targetDate,
      progress: 0,
      status: 'Not Started',
      priority: newGoal.priority,
      milestones
    });

    setNewGoal({
      title: '',
      description: '',
      targetDate: new Date(),
      priority: 'Medium',
      milestones: ''
    });
    setShowAddGoal(false);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(m => 
      m.id === milestoneId 
        ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date() : undefined }
        : m
    );

    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = updatedMilestones.length > 0 
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : 0;

    let status: Goal['status'] = 'Not Started';
    if (progress === 100) status = 'Completed';
    else if (progress > 0) status = 'In Progress';
    else if (new Date() > goal.targetDate) status = 'Overdue';

    onUpdateGoal(goalId, {
      milestones: updatedMilestones,
      progress,
      status
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Goals for {skillName}</h3>
        
        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-professional">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Development Goal</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Complete React certification"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you want to achieve..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newGoal.targetDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoal.targetDate ? format(newGoal.targetDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newGoal.targetDate}
                      onSelect={(date) => date && setNewGoal(prev => ({ ...prev, targetDate: date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="milestones">Milestones (one per line)</Label>
                <Textarea
                  id="milestones"
                  value={newGoal.milestones}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, milestones: e.target.value }))}
                  placeholder="Study fundamentals&#10;Build practice project&#10;Take assessment"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddGoal} className="flex-1 bg-gradient-professional">
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {skillGoals.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium mb-2">No goals set yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create specific, measurable goals to track your skill development
            </p>
            <Button onClick={() => setShowAddGoal(true)} className="bg-gradient-professional">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {skillGoals.map((goal) => (
            <Card key={goal.id} className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Target: {format(goal.targetDate, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>{goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones</span>
                  </div>
                </div>

                {goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Milestones</h5>
                    <div className="space-y-1">
                      {goal.milestones.map((milestone) => (
                        <div 
                          key={milestone.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <button
                            onClick={() => toggleMilestone(goal.id, milestone.id)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              milestone.completed 
                                ? 'bg-success border-success text-success-foreground' 
                                : 'border-muted-foreground hover:border-primary'
                            }`}
                          >
                            {milestone.completed && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                          </button>
                          <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                            {milestone.title}
                          </span>
                          {milestone.completedAt && (
                            <span className="text-xs text-success ml-auto">
                              ✓ {format(milestone.completedAt, "MMM d")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};