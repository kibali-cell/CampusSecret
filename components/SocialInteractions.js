import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const SocialInteractions = ({ missionSubmission }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const db = getFirestore();

  useEffect(() => {
    setLiked(missionSubmission.likes?.includes(user.uid));
  }, [missionSubmission.likes, user.uid]);

  const handleLike = async () => {
    const submissionRef = doc(db, 'mission-submissions', missionSubmission.id);
    await updateDoc(submissionRef, {
      likes: liked 
        ? arrayRemove(user.uid)
        : arrayUnion(user.uid)
    });
    setLiked(!liked);
  };

  const handleComment = async () => {
    if (comment.trim()) {
      const submissionRef = doc(db, 'mission-submissions', missionSubmission.id);
      await updateDoc(submissionRef, {
        comments: arrayUnion({
          userId: user.uid,
          text: comment,
          timestamp: new Date().toISOString(),
          userRole: user.role
        })
      });
      setComment('');
    }
  };

  return (
    <View style={styles.socialContainer}>
      <View style={styles.interactionButtons}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={handleLike}
        >
          <Heart 
            size={24} 
            color={liked ? '#FF4081' : '#666'} 
            fill={liked ? '#FF4081' : 'none'} 
          />
          <Text style={styles.interactionCount}>
            {missionSubmission.likes?.length || 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MessageCircle size={24} color="#666" />
          <Text style={styles.interactionCount}>
            {missionSubmission.comments?.length || 0}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          multiline
        />
        <TouchableOpacity 
          style={styles.commentButton}
          onPress={handleComment}
        >
          <Text style={styles.commentButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      
      {missionSubmission.comments?.map((comment, index) => (
        <View key={index} style={styles.commentItem}>
          <Text style={styles.commentRole}>{comment.userRole}</Text>
          <Text style={styles.commentText}>{comment.text}</Text>
          <Text style={styles.commentTime}>
            {new Date(comment.timestamp).toLocaleString()}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default SocialInteractions;

