const AdminScreen = () => {
    const [stats, setStats] = useState(null);
    const [pendingMissions, setPendingMissions] = useState([]);
  
    useEffect(() => {
      loadAdminData();
    }, []);
  
    const loadAdminData = async () => {
      const stats = await AdminService.getMissionStats();
      setStats(stats);
  
      const pendingQuery = query(
        collection(db, 'mission-submissions'),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(pendingQuery);
      setPendingMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.statsOverview}>
          <Text style={styles.statsTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Total Missions" value={stats?.totalMissions} />
            <StatCard title="Active Users" value={stats?.activeUsers} />
            <StatCard title="Completion Rate" value={`${stats?.completionRate}%`} />
          </View>
        </View>
  
        <View style={styles.pendingMissions}>
          <Text style={styles.pendingTitle}>Pending Verifications</Text>
          <FlatList
            data={pendingMissions}
            renderItem={({ item }) => (
              <View style={styles.missionItem}>
                <Image source={{ uri: item.evidenceUrl }} style={styles.evidenceImage} />
                <View style={styles.missionDetails}>
                  <Text style={styles.missionTitle}>{item.mission.title}</Text>
                  <Text>By: {item.userEmail}</Text>
                  <View style={styles.verificationButtons}>
                    <TouchableOpacity 
                      style={[styles.verifyButton, styles.approveButton]}
                      onPress={() => AdminService.verifyMission(item.id, true)}>
                      <Text>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.verifyButton, styles.rejectButton]}
                      onPress={() => AdminService.verifyMission(item.id, false)}>
                      <Text>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    );
  };