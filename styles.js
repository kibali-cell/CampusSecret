import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    missionCard: {
      backgroundColor: '#f5f5f5',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    missionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    missionDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    missionPoints: {
      fontSize: 14,
      color: '#007AFF',
      fontWeight: 'bold',
    },
    messageContainer: {
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      maxWidth: '80%',
    },
    messageText: {
      fontSize: 16,
    },
    leaderboardItem: {
      flexDirection: 'row',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      alignItems: 'center',
    },
    rank: {
      fontSize: 18,
      fontWeight: 'bold',
      width: 50,
    },
    name: {
      fontSize: 16,
      flex: 1,
    },
    points: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    achievementCard: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
    },
    unlockedCard: {
      backgroundColor: '#f0f8ff',
    },
    achievementInfo: {
      flex: 1,
      marginLeft: 10,
    },
    achievementTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    achievementDesc: {
      fontSize: 14,
      color: '#666',
      marginTop: 2,
    },
    progressBar: {
      height: 4,
      backgroundColor: '#ddd',
      borderRadius: 2,
      marginTop: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#007AFF',
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },
    points: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    historyCard: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    historyPoints: {
      fontSize: 16,
      color: '#007AFF',
      fontWeight: 'bold',
    },
    evidenceImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginTop: 10,
    },
    historyDate: {
      fontSize: 14,
      color: '#666',
      marginTop: 8,
    },
    socialContainer: {
      padding: 10,
    },
    interactionButtons: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    iconButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    interactionCount: {
      marginLeft: 5,
      color: '#666',
    },
    commentSection: {
      marginTop: 10,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
    },
    commentItem: {
      marginBottom: 10,
    },
    commentRole: {
      fontWeight: 'bold',
      marginBottom: 2,
    },
    commentText: {
      marginBottom: 2,
    },
    commentTime: {
      fontSize: 12,
      color: '#666',
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    rank: {
      width: 40,
      fontSize: 18,
      fontWeight: 'bold',
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    playerCategory: {
      fontSize: 14,
      color: '#666',
    },
    points: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    teamMember: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    missionDetails: {
      marginTop: 5,
      color: '#666',
    },
  });
  
    export default styles;