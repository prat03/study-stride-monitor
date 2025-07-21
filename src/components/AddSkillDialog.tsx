import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Star } from 'lucide-react';
import type { Skill } from './SkillCard';

interface AddSkillDialogProps {
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
}

const skillCategories = [
  'Technical Skills',
  'Leadership',
  'Communication',
  'Problem Solving',
  'Project Management',
  'Data Analysis',
  'Design',
  'Sales & Marketing',
  'Customer Service',
  'Other'
];

const levelLabels = {
  1: 'Beginner',
  2: 'Developing', 
  3: 'Proficient',
  4: 'Advanced',
  5: 'Expert'
};

export const AddSkillDialog = ({ onAddSkill }: AddSkillDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    currentLevel: 1 as 1 | 2 | 3 | 4 | 5,
    targetLevel: 3 as 1 | 2 | 3 | 4 | 5,
    importance: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.category) return;
    
    onAddSkill({
      ...formData,
      lastAssessed: new Date(),
      isImproving: false,
    });
    
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      currentLevel: 1,
      targetLevel: 3,
      importance: 'Medium',
    });
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < level 
            ? 'fill-current text-skill-expert' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-professional">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., JavaScript, Public Speaking, Data Analysis"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this skill..."
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Current Level</Label>
            <RadioGroup
              value={formData.currentLevel.toString()}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                currentLevel: parseInt(value) as 1 | 2 | 3 | 4 | 5 
              }))}
              className="flex flex-wrap gap-2"
            >
              {Object.entries(levelLabels).map(([level, label]) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`current-${level}`} />
                  <Label 
                    htmlFor={`current-${level}`} 
                    className="flex items-center gap-1 text-sm cursor-pointer"
                  >
                    {label}
                    <div className="flex">
                      {renderStars(parseInt(level))}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Target Level</Label>
            <RadioGroup
              value={formData.targetLevel.toString()}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                targetLevel: parseInt(value) as 1 | 2 | 3 | 4 | 5 
              }))}
              className="flex flex-wrap gap-2"
            >
              {Object.entries(levelLabels).map(([level, label]) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`target-${level}`} />
                  <Label 
                    htmlFor={`target-${level}`} 
                    className="flex items-center gap-1 text-sm cursor-pointer"
                  >
                    {label}
                    <div className="flex">
                      {renderStars(parseInt(level))}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Importance</Label>
            <Select
              value={formData.importance}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                importance: value as 'Low' | 'Medium' | 'High' | 'Critical' 
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-professional">
              Add Skill
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};