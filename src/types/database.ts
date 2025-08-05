export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  theme_preference?: string;
  notification_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  current_level: number;
  target_level: number;
  importance: string;
  last_assessed?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  total_hours: number;
  studied_hours: number;
  progress: number;
  is_active?: boolean;
  last_studied?: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  course_id: string;
  start_time: string;
  end_time?: string;
  duration: number;
  notes?: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  skill_id?: string;
  course_id?: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: string;
  priority: string;
  target_date?: string;
  created_at: string;
  updated_at: string;
}