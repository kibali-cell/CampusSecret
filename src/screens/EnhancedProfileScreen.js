const EnhancedProfileScreen = () => {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [stats, setStats] = useState({
      totalPoints: 0,
      rank: '',
      completedMissions: 0,
      successRate: 0
    });
  
    useEffect(() => {
      loadUserStats();
      loadAchievements();
    }, []);
  
    return (
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: user.photoURL || 'default-avatar' }} 
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.email.split('@')[0]}</Text>
          <Text style={styles.role}>{user.role.toUpperCase()}</Text>
        </View>
  
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.rank}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedMissions}</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
  
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <FlatList
            data={achievements}
            renderItem={({ item }) => (
              <View style={styles.achievementItem}>
                <Icon name={item.icon} size={24} color={item.unlocked ? '#FFD700' : '#ccc'} />
                <View>
                  <Text style={styles.achievementTitle}>{item.title}</Text>
                  <Text style={styles.achievementDesc}>{item.description}</Text>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  };