-- Create project_plans table to store user's generated plans
CREATE TABLE IF NOT EXISTS project_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  idea_input TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_plans_user_id ON project_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_project_plans_created_at ON project_plans(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own plans
CREATE POLICY "Users can view their own plans" ON project_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own plans
CREATE POLICY "Users can insert their own plans" ON project_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own plans
CREATE POLICY "Users can update their own plans" ON project_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own plans
CREATE POLICY "Users can delete their own plans" ON project_plans
  FOR DELETE USING (auth.uid() = user_id);
