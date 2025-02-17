export const TEAM_MISSIONS = [
    {
      id: 'flash_mob',
      title: 'Flash Mob',
      description: 'Organize a flash mob with at least 5 players',
      points: 200,
      minPlayers: 5,
      maxPlayers: 15,
      roles: ['hero', 'chaos'],
      timeLimit: 48, // hours
      requirements: {
        photo: true,
        video: true,
        location: true
      }
    },
    {
      id: 'treasure_hunt',
      title: 'Campus Treasure Hunt',
      description: 'Create and complete a treasure hunt across campus',
      points: 150,
      minPlayers: 3,
      maxPlayers: 8,
      roles: ['hero', 'chaos'],
      timeLimit: 24,
      requirements: {
        photo: true,
        location: true
      }
    }
  ];