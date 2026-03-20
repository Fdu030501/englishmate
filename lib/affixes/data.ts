import { Affix, AffixWord } from '@/types'

export const prefixes: Affix[] = [
  {
    id: 'prefix-un',
    type: 'prefix',
    text: 'un-',
    meaning: '不，相反',
    description: '表示否定或相反的意思',
    difficulty: 1,
    examples: ['happy → unhappy', 'able → unable', 'certain → uncertain']
  },
  {
    id: 'prefix-re',
    type: 'prefix',
    text: 're-',
    meaning: '再次，重新',
    description: '表示重复或回到原来的状态',
    difficulty: 1,
    examples: ['write → rewrite', 'turn → return', 'build → rebuild']
  },
  {
    id: 'prefix-dis',
    type: 'prefix',
    text: 'dis-',
    meaning: '不，相反，分离',
    description: '表示否定、相反或分离',
    difficulty: 1,
    examples: ['like → dislike', 'appear → disappear', 'connect → disconnect']
  },
  {
    id: 'prefix-pre',
    type: 'prefix',
    text: 'pre-',
    meaning: '在...之前，预先',
    description: '表示时间或位置上的在前',
    difficulty: 1,
    examples: ['view → preview', 'pay → prepay', 'pare → prepare']
  },
  {
    id: 'prefix-in',
    type: 'prefix',
    text: 'in-',
    meaning: '不，无，非',
    description: '表示否定（用于 l 开头的词前）',
    difficulty: 2,
    examples: ['correct → incorrect', 'visible → invisible', 'active → inactive']
  },
  {
    id: 'prefix-im',
    type: 'prefix',
    text: 'im-',
    meaning: '不，无，非',
    description: '表示否定（用于 m, p, b 开头的词前）',
    difficulty: 2,
    examples: ['possible → impossible', 'polite → impolite', 'balance → imbalance']
  },
  {
    id: 'prefix-mis',
    type: 'prefix',
    text: 'mis-',
    meaning: '错误地，坏',
    description: '表示错误或不当',
    difficulty: 2,
    examples: ['understand → misunderstand', 'take → mistake', 'lead → mislead']
  },
  {
    id: 'prefix-over',
    type: 'prefix',
    text: 'over-',
    meaning: '过度，太',
    description: '表示过分或超过',
    difficulty: 2,
    examples: ['work → overwork', 'eat → overeat', 'come → overcome']
  },
  {
    id: 'prefix-under',
    type: 'prefix',
    text: 'under-',
    meaning: '在...之下，不足',
    description: '表示位置在下或程度不足',
    difficulty: 2,
    examples: ['stand → understand', 'line → underline', 'estimate → underestimate']
  },
  {
    id: 'prefix-co',
    type: 'prefix',
    text: 'co-',
    meaning: '共同，一起',
    description: '表示共同或合作',
    difficulty: 2,
    examples: ['work → coworker', 'operate → cooperate', 'author → coauthor']
  }
]

export const suffixes: Affix[] = [
  {
    id: 'suffix-tion',
    type: 'suffix',
    text: '-tion',
    meaning: '表示行为、状态',
    description: '名词后缀，表示行为、过程或状态',
    difficulty: 1,
    examples: ['act → action', 'educate → education', 'inform → information']
  },
  {
    id: 'suffix-ment',
    type: 'suffix',
    text: '-ment',
    meaning: '表示行为、结果',
    description: '名词后缀，表示行为或结果',
    difficulty: 1,
    examples: ['develop → development', 'enjoy → enjoyment', 'govern → government']
  },
  {
    id: 'suffix-able',
    type: 'suffix',
    text: '-able',
    meaning: '能...的，可...的',
    description: '形容词后缀，表示能够或值得',
    difficulty: 1,
    examples: ['read → readable', 'comfort → comfortable', 'reason → reasonable']
  },
  {
    id: 'suffix-ly',
    type: 'suffix',
    text: '-ly',
    meaning: '...地',
    description: '副词后缀，表示方式或程度',
    difficulty: 1,
    examples: ['quick → quickly', 'happy → happily', 'careful → carefully']
  },
  {
    id: 'suffix-ness',
    type: 'suffix',
    text: '-ness',
    meaning: '表示性质、状态',
    description: '名词后缀，表示性质或状态',
    difficulty: 1,
    examples: ['happy → happiness', 'kind → kindness', 'dark → darkness']
  },
  {
    id: 'suffix-ize',
    type: 'suffix',
    text: '-ize',
    meaning: '使...化，变成',
    description: '动词后缀，表示使成为或变成',
    difficulty: 2,
    examples: ['modern → modernize', 'real → realize', 'standard → standardize']
  },
  {
    id: 'suffix-ify',
    type: 'suffix',
    text: '-ify',
    meaning: '使...化',
    description: '动词后缀，表示使成为',
    difficulty: 2,
    examples: ['simple → simplify', 'beauty → beautify', 'clear → clarify']
  },
  {
    id: 'suffix-less',
    type: 'suffix',
    text: '-less',
    meaning: '无，没有',
    description: '形容词后缀，表示缺乏或没有',
    difficulty: 2,
    examples: ['hope → hopeless', 'care → careless', 'use → useless']
  }
]

export const roots: Affix[] = [
  {
    id: 'root-spect',
    type: 'root',
    text: 'spect',
    meaning: '看',
    description: '来自拉丁语，表示看、观察',
    difficulty: 2,
    examples: ['inspect', 'respect', 'spectator', 'prospect']
  },
  {
    id: 'root-dict',
    type: 'root',
    text: 'dict',
    meaning: '说',
    description: '来自拉丁语，表示说、断言',
    difficulty: 2,
    examples: ['dictate', 'predict', 'contradict', 'dictionary']
  },
  {
    id: 'root-port',
    type: 'root',
    text: 'port',
    meaning: '携带，运',
    description: '来自拉丁语，表示携带或运输',
    difficulty: 2,
    examples: ['import', 'export', 'transport', 'portable']
  },
  {
    id: 'root-rupt',
    type: 'root',
    text: 'rupt',
    meaning: '破，断',
    description: '来自拉丁语，表示破裂或中断',
    difficulty: 3,
    examples: ['interrupt', 'erupt', 'corrupt', 'disrupt']
  },
  {
    id: 'root-scrib-script',
    type: 'root',
    text: 'scrib/script',
    meaning: '写',
    description: '来自拉丁语，表示书写',
    difficulty: 3,
    examples: ['describe', 'prescribe', 'subscribe', 'manuscript']
  },
  {
    id: 'root-struct',
    type: 'root',
    text: 'struct',
    meaning: '建造',
    description: '来自拉丁语，表示建造或构建',
    difficulty: 2,
    examples: ['construct', 'destroy', 'structure', 'instruct']
  },
  {
    id: 'root-ceed-sess',
    type: 'root',
    text: 'ceed/cess',
    meaning: '走，行进',
    description: '来自拉丁语，表示行走或前进',
    difficulty: 3,
    examples: ['proceed', 'success', 'process', 'exceed']
  },
  {
    id: 'root-ceive-cept',
    type: 'root',
    text: 'ceive/cept',
    meaning: '拿，取',
    description: '来自拉丁语，表示拿取或接受',
    difficulty: 3,
    examples: ['receive', 'accept', 'concept', 'perceive']
  }
]

export const allAffixes: Affix[] = [...prefixes, ...suffixes, ...roots]
