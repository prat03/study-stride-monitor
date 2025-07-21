import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, CheckCircle } from 'lucide-react';
import type { Skill } from './SkillCard';

interface SkillAssessmentProps {
  skill: Skill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (skillId: string, newLevel: number, notes?: string) => void;
}

const levelDescriptions = {
  1: {
    label: 'Beginner',
    description: 'Limited knowledge or experience. Requires significant guidance and support.',
    criteria: ['Basic understanding of concepts', 'Can perform simple tasks with help', 'Learning fundamentals']
  },
  2: {
    label: 'Developing', 
    description: 'Some knowledge and experience. Can work with supervision.',
    criteria: ['Understands key concepts', 'Can perform routine tasks', 'Developing practical skills']
  },
  3: {
    label: 'Proficient',
    description: 'Good working knowledge. Can work independently on most tasks.',
    criteria: ['Solid understanding and application', 'Works independently', 'Solves common problems']
  },
  4: {
    label: 'Advanced',
    description: 'High level of expertise. Can mentor others and handle complex situations.',
    criteria: ['Deep expertise and insight', 'Mentors others', 'Handles complex challenges']
  },
  5: {
    label: 'Expert',
    description: 'Recognized expert. Drives innovation and best practices.',
    criteria: ['Industry-recognized expertise', 'Drives innovation', 'Sets standards and best practices']
  }
};

export const SkillAssessment = ({ skill, open, onOpenChange, onComplete }: SkillAssessmentProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(skill?.currentLevel.toString() || '1');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'assessment' | 'confirmation'>('assessment');

  const handleSubmit = () => {
    if (skill && selectedLevel) {
      onComplete(skill.id, parseInt(selectedLevel), notes);
      setStep('assessment');
      setNotes('');
      onOpenChange(false);
    }
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < level 
            ? 'fill-current text-skill-expert' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  if (!skill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Assess Your Skill: {skill.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Evaluate your current proficiency level honestly. This will help create better development goals.
          </p>
        </DialogHeader>

        {step === 'assessment' && (
          <div className="space-y-6">
            <RadioGroup
              value={selectedLevel}
              onValueChange={setSelectedLevel}
              className="space-y-4"
            >
              {Object.entries(levelDescriptions).map(([level, info]) => (
                <div key={level} className="space-y-2">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={level} id={level} />
                    <Label 
                      htmlFor={level} 
                      className="flex-1 cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{info.label}</span>
                          <div className="flex">
                            {renderStars(parseInt(level))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {info.criteria.map((criterion, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="notes">Assessment Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific details about your current capabilities, recent experiences, or areas you'd like to focus on..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setStep('confirmation')}
                className="flex-1 bg-gradient-professional"
                disabled={!selectedLevel}
              >
                Continue
              </Button>
              <Button 
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Assessment Summary</h3>
              <p className="text-muted-foreground">
                You've assessed your <strong>{skill.name}</strong> skill as:
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-semibold">
                  {levelDescriptions[parseInt(selectedLevel) as keyof typeof levelDescriptions].label}
                </span>
                <div className="flex">
                  {renderStars(parseInt(selectedLevel))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {levelDescriptions[parseInt(selectedLevel) as keyof typeof levelDescriptions].description}
              </p>
            </div>

            {notes && (
              <div className="text-left p-4 bg-card border rounded-lg">
                <h4 className="font-medium mb-2">Your Notes:</h4>
                <p className="text-sm text-muted-foreground">{notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-gradient-success"
              >
                Complete Assessment
              </Button>
              <Button 
                onClick={() => setStep('assessment')}
                variant="outline"
              >
                Back to Edit
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};