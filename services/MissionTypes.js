export const MISSION_TYPES = {
  HERO: [
    {
      type: 'HELP',
      templates: [
        {
          title: 'Library Hero',
          description: 'Help someone find a book in the library. Take a selfie together (with permission).',
          points: 50,
          timeLimit: 24 * 60 * 60 * 1000, // 24 hours
          requiresPhoto: true
        },
        {
          title: 'Note Master',
          description: 'Share your class notes with 3 people who missed class. Get their signatures.',
          points: 30,
          timeLimit: 48 * 60 * 60 * 1000,
          requiresPhoto: true
        },
        {
          title: 'Campus Clean-up',
          description: 'Pick up 10 pieces of litter around campus. Document before/after.',
          points: 40,
          timeLimit: 24 * 60 * 60 * 1000,
          requiresPhoto: true
        }
      ]
    },
    {
      type: 'SOCIAL',
      templates: [
        {
          title: 'Flash Study Group',
          description: 'Organize an impromptu study group of 5+ people. Take a group photo.',
          points: 60,
          timeLimit: 3 * 60 * 60 * 1000,
          requiresPhoto: true
        },
        {
          title: 'Welcome Ambassador',
          description: 'Help a lost-looking student find their way. Get a thank you note.',
          points: 35,
          timeLimit: 24 * 60 * 60 * 1000,
          requiresPhoto: false
        }
      ]
    }
  ],
  CHAOS: [
    {
      type: 'PRANKS',
      templates: [
        {
          title: 'Reverse Day',
          description: 'Convince 3 people to walk backwards to class. Film their participation.',
          points: 45,
          timeLimit: 24 * 60 * 60 * 1000,
          requiresPhoto: true
        },
        {
          title: 'Chair Artist',
          description: 'Rearrange study room chairs into a funny pattern. Document your art.',
          points: 25,
          timeLimit: 12 * 60 * 60 * 1000,
          requiresPhoto: true
        }
      ]
    },
    {
      type: 'RUMORS',
      templates: [
        {
          title: 'Trend Setter',
          description: 'Start a harmless trend. Get 5 people to participate. Document evidence.',
          points: 50,
          timeLimit: 48 * 60 * 60 * 1000,
          requiresPhoto: true
        },
        {
          title: 'Mystery Event',
          description: 'Create and post a funny fake event poster. Photograph reactions.',
          points: 40,
          timeLimit: 24 * 60 * 60 * 1000,
          requiresPhoto: true
        }
      ]
    }
  ]
  };