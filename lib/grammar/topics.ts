export interface GrammarTopic {
  id: string
  name: string
  description: string
  difficulty: number
  examples: string[]
  commonMistakes: string[]
}

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'tense-present-simple',
    name: '一般现在时',
    description: '表示经常性、习惯性的动作或客观事实',
    difficulty: 1,
    examples: [
      'I work every day.',
      'She plays tennis on weekends.',
      'The sun rises in the east.'
    ],
    commonMistakes: [
      'I works every day. (错误：第三人称单数才加 s)',
      'She play tennis. (错误：she 是第三人称单数)'
    ]
  },
  {
    id: 'tense-past-simple',
    name: '一般过去时',
    description: '表示过去某个时间发生的动作或存在的状态',
    difficulty: 1,
    examples: [
      'I worked yesterday.',
      'She went to school last week.',
      'They lived here in 2020.'
    ],
    commonMistakes: [
      'I work yesterday. (错误：需要用过去式)',
      'She go to school last week. (错误：go 的过去式是 went)'
    ]
  },
  {
    id: 'tense-present-perfect',
    name: '现在完成时',
    description: '表示过去发生的动作对现在有影响或持续到现在',
    difficulty: 2,
    examples: [
      'I have worked here for 5 years.',
      'She has finished her homework.',
      'They have been to Beijing.'
    ],
    commonMistakes: [
      'I have worked here since 5 years. (错误：for + 时间段)',
      'She has finish her homework. (错误：have/has + 过去分词)'
    ]
  },
  {
    id: 'modal-can-could',
    name: '情态动词 can/could',
    description: '表示能力、可能性、请求等',
    difficulty: 1,
    examples: [
      'I can swim.',
      'Could you help me?',
      'It could rain tomorrow.'
    ],
    commonMistakes: [
      'I can to swim. (错误：can + 动词原形)',
      'She cans swim. (错误：情态动词无人称变化)'
    ]
  },
  {
    id: 'modal-must-have-to',
    name: '情态动词 must/have to',
    description: '表示必须、不得不',
    difficulty: 2,
    examples: [
      'You must finish your homework.',
      'I have to go now.',
      'She had to leave early.'
    ],
    commonMistakes: [
      'You must to finish. (错误：must + 动词原形)',
      'He musts go. (错误：must 无人称变化)'
    ]
  },
  {
    id: 'modal-should',
    name: '情态动词 should',
    description: '表示应该、建议',
    difficulty: 1,
    examples: [
      'You should study harder.',
      'He should see a doctor.',
      'We should arrive by 6.'
    ],
    commonMistakes: [
      'You should to study. (错误：should + 动词原形)',
      'He shoulds go. (错误：should 无人称变化)'
    ]
  },
  {
    id: 'clause-noun',
    name: '名词性从句',
    description: '在句中起名词作用的从句，可作主语、宾语、表语',
    difficulty: 3,
    examples: [
      'What he said is true.',
      'I know that he is honest.',
      'The question is whether we can win.'
    ],
    commonMistakes: [
      'What he said are true. (错误：主语从句视为单数)',
      'I know what he is honest. (错误：that 引导宾语从句)'
    ]
  },
  {
    id: 'clause-attributive',
    name: '定语从句',
    description: '修饰名词的从句，由关系代词或关系副词引导',
    difficulty: 3,
    examples: [
      'The man who is speaking is my teacher.',
      'This is the book that I bought.',
      'The house where I live is small.'
    ],
    commonMistakes: [
      'The man which is speaking... (错误：人用 who)',
      'This is the book where I bought. (错误：bought 缺宾语，用 that/which)'
    ]
  },
  {
    id: 'non-finite-infinitive',
    name: '不定式',
    description: '动词原形前加 to，可作主语、宾语、定语等',
    difficulty: 2,
    examples: [
      'To learn English is important.',
      'I want to go home.',
      'She has a lot of work to do.'
    ],
    commonMistakes: [
      'I want go home. (错误：want to do)',
      'I enjoy to swim. (错误：enjoy doing)'
    ]
  },
  {
    id: 'non-finite-gerund',
    name: '动名词',
    description: '动词 + ing 形式，具有名词性质',
    difficulty: 2,
    examples: [
      'Swimming is good exercise.',
      'I enjoy reading books.',
      'She is good at painting.'
    ],
    commonMistakes: [
      'I enjoy to read. (错误：enjoy doing)',
      'She is good at to swim. (错误：介词后用 doing)'
    ]
  }
]

export const diagnosticQuestions = [
  {
    id: 1,
    topic: 'tense-present-simple',
    question: 'She ___ (work) in a hospital.',
    answer: 'works',
    options: ['work', 'works', 'working', 'worked']
  },
  {
    id: 2,
    topic: 'tense-past-simple',
    question: 'I ___ (go) to the cinema last night.',
    answer: 'went',
    options: ['go', 'goes', 'went', 'gone']
  },
  {
    id: 3,
    topic: 'tense-present-perfect',
    question: 'They ___ (live) here for 10 years.',
    answer: 'have lived',
    options: ['live', 'lived', 'have lived', 'are living']
  },
  {
    id: 4,
    topic: 'modal-can-could',
    question: '___ you help me with this bag?',
    answer: 'Could',
    options: ['Can', 'Could', 'May', 'Might']
  },
  {
    id: 5,
    topic: 'modal-must-have-to',
    question: 'You ___ finish your homework before going out.',
    answer: 'must',
    options: ['can', 'may', 'must', 'could']
  },
  {
    id: 6,
    topic: 'modal-should',
    question: 'You look tired. You ___ take a rest.',
    answer: 'should',
    options: ['can', 'must', 'should', 'will']
  },
  {
    id: 7,
    topic: 'clause-noun',
    question: '___ he said surprised everyone.',
    answer: 'What',
    options: ['That', 'What', 'Which', 'Who']
  },
  {
    id: 8,
    topic: 'clause-attributive',
    question: 'The man ___ is standing there is my uncle.',
    answer: 'who',
    options: ['which', 'who', 'whom', 'whose']
  },
  {
    id: 9,
    topic: 'non-finite-infinitive',
    question: 'I want ___ home now.',
    answer: 'to go',
    options: ['go', 'going', 'to go', 'gone']
  },
  {
    id: 10,
    topic: 'non-finite-gerund',
    question: 'She enjoys ___ books.',
    answer: 'reading',
    options: ['read', 'to read', 'reading', 'reads']
  }
]
