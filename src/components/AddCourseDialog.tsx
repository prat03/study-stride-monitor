import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import type { Course } from './CourseCard';

interface AddCourseDialogProps {
  onAddCourse: (course: Omit<Course, 'id' | 'progress' | 'studiedHours'>) => void;
  editCourse?: Course;
  onEditCourse?: (course: Course) => void;
}

export const AddCourseDialog = ({ onAddCourse, editCourse, onEditCourse }: AddCourseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: editCourse?.title || '',
    description: editCourse?.description || '',
    category: editCourse?.category || '',
    totalHours: editCourse?.totalHours || 10,
  });

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Language',
    'Science',
    'Mathematics',
    'Arts',
    'Music',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category) return;
    
    if (editCourse && onEditCourse) {
      onEditCourse({
        ...editCourse,
        ...formData,
      });
    } else {
      onAddCourse({
        ...formData,
        isActive: false,
      });
    }
    
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      totalHours: 10,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editCourse ? (
          <Button variant="outline" size="sm">Edit Course</Button>
        ) : (
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editCourse ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., React Fundamentals"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the course..."
              rows={3}
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
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalHours">Estimated Total Hours</Label>
            <Input
              id="totalHours"
              type="number"
              min="1"
              max="1000"
              value={formData.totalHours}
              onChange={(e) => setFormData(prev => ({ ...prev, totalHours: parseInt(e.target.value) || 10 }))}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-gradient-primary">
              {editCourse ? 'Update Course' : 'Add Course'}
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