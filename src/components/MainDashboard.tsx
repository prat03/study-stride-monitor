import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SkillDashboard } from './SkillDashboard';
import { LearningDashboard } from './LearningDashboard';
import { AppHeader } from './AppHeader';
import { Target, BookOpen, BarChart3, Calendar } from 'lucide-react';

export const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('skills');

  return (
    <div className="min-h-screen bg-gradient-background">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to your Learning Journey
          </h2>
          <p className="text-muted-foreground">
            Track your skills, manage courses, and achieve your learning goals
          </p>
        </div>

        <Card className="mb-6 shadow-soft">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="skills" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Learning
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-0">
                <SkillDashboard />
              </TabsContent>

              <TabsContent value="learning" className="mt-0">
                <LearningDashboard />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Advanced analytics coming soon. Track your progress and performance insights.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Learning Calendar</h3>
                  <p className="text-muted-foreground">
                    Schedule your study sessions and track your learning timeline.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};