import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: boolean;
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  gradient = false 
}: StatsCardProps) => {
  return (
    <Card className={`shadow-soft hover:shadow-glow transition-all duration-300 ${
      gradient ? 'bg-gradient-primary text-primary-foreground' : ''
    }`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium flex items-center justify-between ${
          gradient ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}>
          {title}
          <Icon className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${
            gradient ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {value}
          </div>
          
          {description && (
            <p className={`text-xs ${
              gradient ? 'text-primary-foreground/80' : 'text-muted-foreground'
            }`}>
              {description}
            </p>
          )}
          
          {trend && (
            <div className={`flex items-center text-xs ${
              trend.isPositive 
                ? gradient ? 'text-success-foreground' : 'text-success' 
                : 'text-destructive'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span className="ml-1">{Math.abs(trend.value)}% vs last week</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};