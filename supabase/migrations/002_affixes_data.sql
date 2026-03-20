-- Seed data for affixes table
-- Phase 1: Common prefixes, suffixes, and roots

-- Prefixes
INSERT INTO affixes (id, type, text, meaning, description, difficulty, examples) VALUES
  ('prefix-un', 'prefix', 'un-', '不，相反', '表示否定或相反的意思', 1, '["happy → unhappy", "able → unable", "certain → uncertain"]'),
  ('prefix-re', 'prefix', 're-', '再次，重新', '表示重复或回到原来的状态', 1, '["write → rewrite", "turn → return", "build → rebuild"]'),
  ('prefix-dis', 'prefix', 'dis-', '不，相反，分离', '表示否定、相反或分离', 1, '["like → dislike", "appear → disappear", "connect → disconnect"]'),
  ('prefix-pre', 'prefix', 'pre-', '在...之前，预先', '表示时间或位置上的在前', 1, '["view → preview", "pay → prepay", "pare → prepare"]'),
  ('prefix-in', 'prefix', 'in-', '不，无，非', '表示否定（用于 l 开头的词前）', 2, '["correct → incorrect", "visible → invisible", "active → inactive"]'),
  ('prefix-im', 'prefix', 'im-', '不，无，非', '表示否定（用于 m, p, b 开头的词前）', 2, '["possible → impossible", "polite → impolite", "balance → imbalance"]'),
  ('prefix-mis', 'prefix', 'mis-', '错误地，坏', '表示错误或不当', 2, '["understand → misunderstand", "take → mistake", "lead → mislead"]'),
  ('prefix-over', 'prefix', 'over-', '过度，太', '表示过分或超过', 2, '["work → overwork", "eat → overeat", "come → overcome"]'),
  ('prefix-under', 'prefix', 'under-', '在...之下，不足', '表示位置在下或程度不足', 2, '["stand → understand", "line → underline", "estimate → underestimate"]'),
  ('prefix-co', 'prefix', 'co-', '共同，一起', '表示共同或合作', 2, '["work → coworker", "operate → cooperate", "author → coauthor"]');

-- Suffixes
INSERT INTO affixes (id, type, text, meaning, description, difficulty, examples) VALUES
  ('suffix-tion', 'suffix', '-tion', '表示行为、状态', '名词后缀，表示行为、过程或状态', 1, '["act → action", "educate → education", "inform → information"]'),
  ('suffix-ment', 'suffix', '-ment', '表示行为、结果', '名词后缀，表示行为或结果', 1, '["develop → development", "enjoy → enjoyment", "govern → government"]'),
  ('suffix-able', 'suffix', '-able', '能...的，可...的', '形容词后缀，表示能够或值得', 1, '["read → readable", "comfort → comfortable", "reason → reasonable"]'),
  ('suffix-ly', 'suffix', '-ly', '...地', '副词后缀，表示方式或程度', 1, '["quick → quickly", "happy → happily", "careful → carefully"]'),
  ('suffix-ness', 'suffix', '-ness', '表示性质、状态', '名词后缀，表示性质或状态', 1, '["happy → happiness", "kind → kindness", "dark → darkness"]'),
  ('suffix-ize', 'suffix', '-ize', '使...化，变成', '动词后缀，表示使成为或变成', 2, '["modern → modernize", "real → realize", "standard → standardize"]'),
  ('suffix-ify', 'suffix', '-ify', '使...化', '动词后缀，表示使成为', 2, '["simple → simplify", "beauty → beautify", "clear → clarify"]'),
  ('suffix-less', 'suffix', '-less', '无，没有', '形容词后缀，表示缺乏或没有', 2, '["hope → hopeless", "care → careless", "use → useless"]');

-- Roots
INSERT INTO affixes (id, type, text, meaning, description, difficulty, examples) VALUES
  ('root-spect', 'root', 'spect', '看', '来自拉丁语，表示看、观察', 2, '["inspect", "respect", "spectator", "prospect"]'),
  ('root-dict', 'root', 'dict', '说', '来自拉丁语，表示说、断言', 2, '["dictate", "predict", "contradict", "dictionary"]'),
  ('root-port', 'root', 'port', '携带，运', '来自拉丁语，表示携带或运输', 2, '["import", "export", "transport", "portable"]'),
  ('root-rupt', 'root', 'rupt', '破，断', '来自拉丁语，表示破裂或中断', 3, '["interrupt", "erupt", "corrupt", "disrupt"]'),
  ('root-scrib-script', 'root', 'scrib/script', '写', '来自拉丁语，表示书写', 3, '["describe", "prescribe", "subscribe", "manuscript"]'),
  ('root-struct', 'root', 'struct', '建造', '来自拉丁语，表示建造或构建', 2, '["construct", "destroy", "structure", "instruct"]'),
  ('root-ceed-sess', 'root', 'ceed/cess', '走，行进', '来自拉丁语，表示行走或前进', 3, '["proceed", "success", "process", "exceed"]'),
  ('root-ceive-cept', 'root', 'ceive/cept', '拿，取', '来自拉丁语，表示拿取或接受', 3, '["receive", "accept", "concept", "perceive"]');

-- Sample affix words (衍生词)
INSERT INTO affix_words (affix_id, word, part_of_speech, meaning, sentences, collocations, difficulty) VALUES
  -- un- derivatives
  ('prefix-un', 'unhappy', 'adj.', '不快乐的', '["She was unhappy with the result."]', '["unhappy with", "unhappy about"]', 1),
  ('prefix-un', 'unable', 'adj.', '不能的', '["I am unable to attend the meeting."]', '["unable to do"]', 1),
  ('prefix-un', 'uncertain', 'adj.', '不确定的', '["I am uncertain about the plan."]', '["uncertain about"]', 1),
  ('prefix-un', 'unfair', 'adj.', '不公平的', '["It is unfair to judge without knowing the facts."]', '["unfair to"]', 1),
  ('prefix-un', 'unlock', 'v.', '开锁', '["Please unlock the door."]', '["unlock the door"]', 1),

  -- re- derivatives
  ('prefix-re', 'rewrite', 'v.', '重写', '["I need to rewrite this essay."]', '["rewrite the story"]', 1),
  ('prefix-re', 'return', 'v.', '返回', '["She will return tomorrow."]', '["return home"]', 1),
  ('prefix-re', 'rebuild', 'v.', '重建', '["They are rebuilding the house."]', '["rebuild the city"]', 1),
  ('prefix-re', 'review', 'v.', '复习，回顾', '["I need to review my notes."]', '["review the lesson"]', 1),

  -- dis- derivatives
  ('prefix-dis', 'dislike', 'v.', '不喜欢', '["I dislike waking up early."]', '["dislike doing"]', 1),
  ('prefix-dis', 'disappear', 'v.', '消失', '["The sun disappeared behind the clouds."]', '["disappear from"]', 1),
  ('prefix-dis', 'disconnect', 'v.', '断开连接', '["Please disconnect the cable."]', '["disconnect from"]', 1),

  -- -tion derivatives
  ('suffix-tion', 'action', 'n.', '行动', '["We need to take action now."]', '["take action", "in action"]', 1),
  ('suffix-tion', 'education', 'n.', '教育', '["Education is important for everyone."]', '["higher education"]', 1),
  ('suffix-tion', 'information', 'n.', '信息', '["I need more information about this."]', '["information about"]', 1),

  -- -ment derivatives
  ('suffix-ment', 'development', 'n.', '发展', '["The development of technology is rapid."]', '["economic development"]', 1),
  ('suffix-ment', 'enjoyment', 'n.', '享受', '["Reading brings me great enjoyment."]', '["for enjoyment"]', 1),
  ('suffix-ment', 'government', 'n.', '政府', '["The government announced new policies."]', '["local government"]', 1),

  -- -able derivatives
  ('suffix-able', 'readable', 'adj.', '可读的', '["The handwriting is barely readable."]', '["highly readable"]', 1),
  ('suffix-able', 'comfortable', 'adj.', '舒适的', '["This chair is very comfortable."]', '["comfortable with"]', 1),
  ('suffix-able', 'reasonable', 'adj.', '合理的', '["That is a reasonable price."]', '["reasonable price"]', 1),

  -- spect derivatives
  ('root-spect', 'inspect', 'v.', '检查', '["The teacher inspected our work."]', '["inspect the building"]', 2),
  ('root-spect', 'respect', 'v./n.', '尊敬', '["I respect my teachers."]', '["show respect"]', 2),
  ('root-spect', 'spectator', 'n.', '观众', '["The spectators cheered loudly."]', '["spectator sports"]', 2),
  ('root-spect', 'prospect', 'n.', '前景', '["The prospect of success is bright."]', '["job prospect"]', 2),

  -- dict derivatives
  ('root-dict', 'dictate', 'v.', '口述，听写', '["The teacher dictated the words."]', '["dictate a letter"]', 2),
  ('root-dict', 'predict', 'v.', '预测', '["It is hard to predict the future."]', '["predict the outcome"]', 2),
  ('root-dict', 'contradict', 'v.', '反驳，与...矛盾', '["The evidence contradicts his story."]', '["contradict oneself"]', 2),
  ('root-dict', 'dictionary', 'n.', '词典', '["Look up the word in the dictionary."]', '["English dictionary"]', 1);
