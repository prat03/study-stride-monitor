import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, Target, ChevronRight, BarChart3 } from 'lucide-react';

export interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: 1 | 2 | 3 | 4 | 5; // 1: Beginner, 2: Developing, 3: Proficient, 4: Advanced, 5: Expert
  targetLevel: 1 | 2 | 3 | 4 | 5;
  importance: 'Low' | 'Medium' | 'High' | 'Critical';
  lastAssessed?: Date;
  description?: string;
  isImproving?: boolean;
}

interface SkillCardProps {
  skill: Skill;
  onAssess?: (skillId: string) => void;
  onViewGoals?: (skillId: string) => void;
}

const levelLabels = {
  1: 'Beginner',
  2: 'Developing', 
  3: 'Proficient',
  4: 'Advanced',
  5: 'Expert'
};

const levelColors = {
  1: 'text-skill-beginner border-skill-beginner',
  2: 'text-warning border-warning',
  3: 'text-skill-intermediate border-skill-intermediate',
  4: 'text-skill-advanced border-skill-advanced',
  5: 'text-skill-expert border-skill-expert'
};

const importanceColors = {
  'Low': 'bg-muted text-muted-foreground',
  'Medium': 'bg-warning/20 text-warning border-warning/30',
  'High': 'bg-skill-intermediate/20 text-skill-intermediate border-skill-intermediate/30',
  'Critical': 'bg-destructive/20 text-destructive border-destructive/30'
};

export const SkillCard = ({ skill, onAssess, onViewGoals }: SkillCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const skillGap = skill.targetLevel - skill.currentLevel;
  const progressPercentage = (skill.currentLevel / skill.targetLevel) * 100;
  
  const formatLastAssessed = (date?: Date) => {
    if (!date) return 'Never assessed';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Assessed today';
    if (days === 1) return 'Assessed yesterday';
    if (days < 30) return `Assessed ${days} days ago`;
    return `Assessed ${Math.floor(days / 30)} months ago`;
  };

  const getSkillGapMessage = () => {
    if (skillGap === 0) return 'Target achieved!';
    if (skillGap === 1) return '1 level to go';
    return `${skillGap} levels to go`;
  };

  return (
    <Card 
      className="shadow-soft hover:shadow-assessment transition-all duration-300 animate-fade-in group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center gap-2">
              {skill.name}
              {skill.isImproving && (
                <TrendingUp className="h-4 w-4 text-success" />
              )}
            </CardTitle>
            {skill.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {skill.description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 ml-2">
            <Badge variant="outline" className="text-xs">
              {skill.category}
            </Badge>
            <Badge 
              className={`text-xs border ${importanceColors[skill.importance]}`}
              variant="outline"
            >
              {skill.importance}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current vs Target Level */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Skill Level</span>
            <span className="text-sm text-muted-foreground">
              {getSkillGapMessage()}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Current</span>
                <span>Target</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${levelColors[skill.currentLevel]}`}
                >
                  {levelLabels[skill.currentLevel]}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${levelColors[skill.targetLevel]}`}
                >
                  {levelLabels[skill.targetLevel]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Info */}
        <div className="flex items-center justify-between text-sm border-t pt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>{formatLastAssessed(skill.lastAssessed)}</span>
          </div>
          
          {progressPercentage < 100 && (
            <div className="flex items-center gap-1 text-primary">
              <Target className="h-4 w-4" />
              <span className="font-medium">{100 - Math.round(progressPercentage)}% gap</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onAssess?.(skill.id)}
            className="flex-1 bg-gradient-professional"
            size="sm"
          >
            <Star className="h-4 w-4 mr-2" />
            Assess Skill
          </Button>
          <Button 
            onClick={() => onViewGoals?.(skill.id)}
            variant="outline"
            size="sm"
            className="hover:bg-muted"
          >
            Goals
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};