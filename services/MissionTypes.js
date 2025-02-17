export const MISSION_TYPES = {
    HERO: [
      {
        type: 'HELP',
        missions: [
          { title: 'Library Guide', description: 'Help someone find study materials', points: 100, duration: '1h' },
          { title: 'Tech Support', description: 'Help someone with computer issues', points: 150, duration: '30m' },
          { title: 'Campus Tour', description: 'Guide a lost student', points: 200, duration: '1h' }
        ]
      },
      {
        type: 'COMMUNITY',
        missions: [
          { title: 'Clean Drive', description: 'Organize a mini cleaning session', points: 300, duration: '2h' },
          { title: 'Study Group', description: 'Form a study group for finals', points: 250, duration: '2h' }
        ]
      }
    ],
    CHAOS: [
      {
        type: 'PRANKS',
        missions: [
          { title: 'Backwards Day', description: 'Get 5 people to walk backwards', points: 100, duration: '1h' },
          { title: 'Silent Library', description: 'Start a silent dance party', points: 200, duration: '30m' }
        ]
      },
      {
        type: 'TRENDS',
        missions: [
          { title: 'New Slang', description: 'Make a new word trend on campus', points: 150, duration: '4h' },
          { title: 'Fashion Statement', description: 'Start a silly fashion trend', points: 200, duration: '1d' }
        ]
      }
    ]
  };