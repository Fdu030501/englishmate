-- EnglishMate Database Schema
-- Phase 1: MVP Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profile - 用户能力画像
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_score INT DEFAULT 0,
  grammar_scores JSONB DEFAULT '{}',
  listening_score INT DEFAULT 0,
  speaking_score INT DEFAULT 0,
  reading_score INT DEFAULT 0,
  last_assessment TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profile_user_id ON user_profile(user_id);

-- Affixes - 词缀库（基础数据表）
CREATE TABLE IF NOT EXISTS affixes (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('prefix', 'suffix', 'root')),
  text TEXT NOT NULL,
  meaning TEXT NOT NULL,
  description TEXT,
  difficulty INT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  examples JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_affixes_type ON affixes(type);
CREATE INDEX idx_affixes_difficulty ON affixes(difficulty);

-- Affix Words - 衍生词表
CREATE TABLE IF NOT EXISTS affix_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affix_id TEXT REFERENCES affixes(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  part_of_speech TEXT,
  meaning TEXT NOT NULL,
  sentences JSONB DEFAULT '[]',
  collocations JSONB DEFAULT '[]',
  difficulty INT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5)
);

CREATE INDEX idx_affix_words_affix_id ON affix_words(affix_id);
CREATE INDEX idx_affix_words_word ON affix_words(word);

-- Affix Progress - 词缀学习进度
CREATE TABLE IF NOT EXISTS affix_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  affix_id TEXT NOT NULL,
  affix_type TEXT NOT NULL,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'learning', 'mastered')),
  mastered_words INT DEFAULT 0,
  total_words INT DEFAULT 0,
  last_practiced TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, affix_id)
);

CREATE INDEX idx_affix_progress_user_id ON affix_progress(user_id);
CREATE INDEX idx_affix_progress_status ON affix_progress(status);

-- Quiz Record - 测试记录
CREATE TABLE IF NOT EXISTS quiz_record (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  quiz_topic TEXT,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  correct_questions INT NOT NULL,
  wrong_questions JSONB DEFAULT '[]',
  time_spent INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_record_user_id ON quiz_record(user_id);
CREATE INDEX idx_quiz_record_type ON quiz_record(quiz_type);
CREATE INDEX idx_quiz_record_created ON quiz_record(created_at);

-- Daily Task - 每日任务
CREATE TABLE IF NOT EXISTS daily_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_task_user_id ON daily_task(user_id);
CREATE INDEX idx_daily_task_date ON daily_task(date);

-- Learning Streak - 学习连续天数
CREATE TABLE IF NOT EXISTS learning_streak (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_learned DATE,
  missed_days DATE[] DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_learning_streak_user_id ON learning_streak(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE affix_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_task ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streak ENABLE ROW LEVEL SECURITY;

-- Policies for user_profile
CREATE POLICY "Users can view their own profile"
  ON user_profile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for affix_progress
CREATE POLICY "Users can view their own progress"
  ON affix_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON affix_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON affix_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for quiz_record
CREATE POLICY "Users can view their own quiz records"
  ON quiz_record FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz records"
  ON quiz_record FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for daily_task
CREATE POLICY "Users can view their own tasks"
  ON daily_task FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON daily_task FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON daily_task FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for learning_streak
CREATE POLICY "Users can view their own streak"
  ON learning_streak FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak"
  ON learning_streak FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak"
  ON learning_streak FOR UPDATE
  USING (auth.uid() = user_id);

-- Affixes table is public (read-only for everyone)
ALTER TABLE affixes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affixes are publicly readable"
  ON affixes FOR SELECT
  TO authenticated
  USING (true);

-- Affix words are public (read-only for everyone)
ALTER TABLE affix_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affix words are publicly readable"
  ON affix_words FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affix_progress_updated_at
  BEFORE UPDATE ON affix_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_streak_updated_at
  BEFORE UPDATE ON learning_streak
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
