import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';

export const AdminService = {
  async createMission(missionData) {
    return await addDoc(collection(db, 'missions'), {
      ...missionData,
      createdAt: new Date().toISOString(),
      status: 'active'
    });
  },

  async verifyMission(missionId, isApproved) {
    const missionRef = doc(db, 'mission-submissions', missionId);
    await updateDoc(missionRef, {
      status: isApproved ? 'approved' : 'rejected',
      verifiedAt: new Date().toISOString()
    });

    if (isApproved) {
      // Update user points
      const submission = await getDoc(missionRef);
      const userRef = doc(db, 'users', submission.data().userId);
      const userDoc = await getDoc(userRef);
      await updateDoc(userRef, {
        points: userDoc.data().points + submission.data().mission.points,
        missionsCompleted: userDoc.data().missionsCompleted + 1
      });
    }
  },

  async getMissionStats() {
    const stats = {
      totalMissions: 0,
      completedMissions: 0,
      activeUsers: 0,
      popularMissions: []
    };

    // Get mission completion stats
    const missionsQuery = query(collection(db, 'mission-submissions'));
    const missionsSnapshot = await getDocs(missionsQuery);
    stats.totalMissions = missionsSnapshot.size;

    // Get active users count
    const usersQuery = query(collection(db, 'users'), 
      where('lastActive', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
    const usersSnapshot = await getDocs(usersQuery);
    stats.activeUsers = usersSnapshot.size;

    return stats;
  }
};