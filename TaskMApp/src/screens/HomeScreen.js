import React, { useEffect, useState } from 'react';
import { 
  getTasks, 
  createTask, 
  updateTaskStatus, 
  editTask, 
  deleteTask 
} from '../services/api';
import LottieView from 'lottie-react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  //  Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      setLoading(true);
      const filters = {};
      if (statusFilter !== 'All') filters.status = statusFilter;
      if (search.trim()) filters.title = search;

      const res = await getTasks(token, filters);
      setTasks(res.tasks);
    } catch (err) {
      console.log('Error fetching tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, search]);

  //  Add new task
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await createTask(newTask.title, newTask.description, token);
      setTasks([res.task, ...tasks]);
      setNewTask({ title: '', description: '' });
      setModalVisible(false);
    } catch (err) {
      console.log('Error adding task:', err.message);
    }
  };

  //  Edit task
  const handleEditTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await editTask(editingTaskId, newTask.title, newTask.description, token);
      setTasks(tasks.map(t => (t._id === editingTaskId ? res.task : t)));
      setModalVisible(false);
      setEditMode(false);
      setEditingTaskId(null);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.log('Error editing task:', err.message);
    }
  };

  //  Delete task
  const handleDeleteTask = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await deleteTask(id, token);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.log('Error deleting task:', err.message);
    }
  };

  //  Mark task completed + play animation
  const handleComplete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await updateTaskStatus(id, token);
      setTasks(tasks.map((t) => (t._id === id ? res.task : t)));
      setShowAnimation(true);
    } catch (err) {
      console.log('Error updating task:', err.message);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.length - completedCount;

  const renderTask = ({ item }) => (
    <View
      style={[
        styles.taskCard,
        { borderColor: item.status === 'Completed' ? '#FFD700' : '#C5A300' },
      ]}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDesc}>{item.description}</Text>

      <View style={styles.taskFooter}>
        <Text
          style={[
            styles.taskStatus,
            { color: item.status === 'Completed' ? '#FFD700' : '#BDBDBD' },
          ]}
        >
          {item.status}
        </Text>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {item.status === 'Pending' && (
            <TouchableOpacity onPress={() => handleComplete(item._id)}>
              <Text style={styles.markDone}>Mark Done</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              setEditMode(true);
              setModalVisible(true);
              setEditingTaskId(item._id);
              setNewTask({ title: item.title, description: item.description });
            }}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteTask(item._id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        placeholderTextColor="#BDBDBD"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        {['All', 'Pending', 'Completed'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterBtn,
              statusFilter === status && styles.activeFilter,
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                statusFilter === status && styles.activeFilterText,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showStats && (
        <View style={styles.statsBox}>
          <Text style={styles.statsText}>Total Tasks: {tasks.length}</Text>
          <Text style={styles.statsText}>Completed: {completedCount}</Text>
          <Text style={styles.statsText}>Pending: {pendingCount}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id}
          renderItem={renderTask}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks found 😴</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditMode(false);
          setNewTask({ title: '', description: '' });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={36} color="#000" />
      </TouchableOpacity>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setShowStats(!showStats)}>
          <MaterialCommunityIcons name="chart-bar" size={28} color="#FFD700" />
        </TouchableOpacity>

        <View style={styles.homeBtn}>
          <Ionicons name="home-outline" size={32} color="#000" />
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Add/Edit Task Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {editMode ? 'Edit Task' : 'Add New Task'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#999"
              value={newTask.title}
              onChangeText={(t) => setNewTask({ ...newTask, title: t })}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              value={newTask.description}
              onChangeText={(t) => setNewTask({ ...newTask, description: t })}
            />

            <TouchableOpacity
              style={styles.goldButton}
              onPress={editMode ? handleEditTask : handleAddTask}
            >
              <Text style={styles.goldButtonText}>
                {editMode ? 'Update Task' : 'Add Task'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showAnimation && (
  <LottieView
    source={require('../../assets/b.json')}
    autoPlay
    loop={false}
    onAnimationFinish={() => setShowAnimation(false)}
    style={{
      width: 180,
      height: 180,
      position: 'absolute',
      top: '40%',
      alignSelf: 'center',
      zIndex: 9999,
      elevation: 10,
    }}
  />
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 40 },
  header: { fontSize: 28, fontWeight: '700', color: '#FFD700', textAlign: 'center', marginBottom: 15 },
  searchInput: {
    backgroundColor: '#121212', color: '#FFD700', borderWidth: 1, borderColor: '#C5A300',
    borderRadius: 10, padding: 10, marginHorizontal: 20, marginBottom: 10,
  },
  filterRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, marginHorizontal: 5, borderWidth: 1, borderColor: '#C5A300', borderRadius: 8 },
  activeFilter: { backgroundColor: '#C5A300' },
  filterText: { color: '#FFD700' },
  activeFilterText: { color: '#000' },
  taskCard: { backgroundColor: '#121212', borderWidth: 1, borderRadius: 10, padding: 12, marginHorizontal: 20, marginVertical: 6 },
  taskTitle: { color: '#FFD700', fontSize: 18, fontWeight: '600' },
  taskDesc: { color: '#BDBDBD', marginTop: 4 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  taskStatus: { fontSize: 14 },
  markDone: { color: '#C5A300', fontWeight: 'bold' },
  editText: { color: '#6CC9FF', fontWeight: 'bold' },
  deleteText: { color: '#FF6B6B', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 50 },
  statsBox: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#C5A300', borderRadius: 10, margin: 15, padding: 15 },
  statsText: { color: '#FFD700', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  addButton: { position: 'absolute', right: 25, bottom: 90, backgroundColor: '#FFD700', borderRadius: 50, padding: 12, elevation: 6 },
  bottomBar: {
    position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', backgroundColor: '#121212', width: '100%', paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#333',
  },
  homeBtn: { backgroundColor: '#FFD700', borderRadius: 30, padding: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#121212', borderRadius: 15, padding: 20, width: '85%', borderWidth: 1, borderColor: '#C5A300' },
  modalHeader: { fontSize: 22, fontWeight: '700', color: '#FFD700', textAlign: 'center', marginBottom: 15 },
  input: {
    backgroundColor: '#0a0a0a', color: '#FFD700', borderWidth: 1, borderColor: '#C5A300',
    borderRadius: 10, padding: 10, marginBottom: 12,
  },
  goldButton: { backgroundColor: '#C5A300', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 5 },
  goldButtonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 10, alignItems: 'center' },
  cancelText: { color: '#FFD700', fontSize: 16 },
});
