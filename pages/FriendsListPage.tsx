import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FriendRequest {
  from: number;
  timestamp: string;
}

interface UserProfile {
  id: number;
  name: string;
  avatarUrl: string;
  level: number;
  friendCode: string;
  friends: number[];
  friendRequests: FriendRequest[];
  outgoingRequests: number[];
}

const FriendsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const profileData = JSON.parse(localStorage.getItem('userProfile') || 'null');
    setUsers(usersData);
    setCurrentUser(profileData);
  }, []);

  const handleAccept = (fromId: number) => {
    if (!currentUser) return;
    const sender = users.find(u => u.id === fromId);
    if (!sender) return;

    const updatedCurrent: UserProfile = {
      ...currentUser,
      friends: [...currentUser.friends, fromId],
      friendRequests: currentUser.friendRequests.filter(r => r.from !== fromId),
    };

    const updatedSender: UserProfile = {
      ...sender,
      friends: [...sender.friends, currentUser.id],
      outgoingRequests: sender.outgoingRequests.filter(id => id !== currentUser.id),
    };

    const updatedAll = users.map(u => {
      if (u.id === fromId) return updatedSender;
      if (u.id === currentUser.id) return updatedCurrent;
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedAll));
    localStorage.setItem('userProfile', JSON.stringify(updatedCurrent));
    setUsers(updatedAll);
    setCurrentUser(updatedCurrent);
  };

  const handleReject = (fromId: number) => {
    if (!currentUser) return;
    const updatedCurrent = {
      ...currentUser,
      friendRequests: currentUser.friendRequests.filter(r => r.from !== fromId),
    };
    const updatedAll = users.map(u =>
      u.id === currentUser.id ? updatedCurrent : u
    );
    localStorage.setItem('users', JSON.stringify(updatedAll));
    localStorage.setItem('userProfile', JSON.stringify(updatedCurrent));
    setUsers(updatedAll);
    setCurrentUser(updatedCurrent);
  };

  const incomingRequests = currentUser?.friendRequests || [];
  const friends = users.filter(u => currentUser?.friends.includes(u.id));

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="text-gray-400">
        ← 返回
      </button>
      <h2 className="text-xl font-bold text-white">好友邀請</h2>
      {incomingRequests.length > 0 ? (
        incomingRequests.map(req => {
          const sender = users.find(u => u.id === req.from);
          return (
            sender && (
              <div key={req.from} className="flex justify-between bg-gray-700 p-3 rounded">
                <div className="flex items-center gap-3">
                  <img src={sender.avatarUrl} alt={sender.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3>{sender.name}</h3>
                    <p className="text-sm text-gray-300">等級 {sender.level}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(req.from)} className="bg-green-600 px-3 py-1 rounded">同意</button>
                  <button onClick={() => handleReject(req.from)} className="bg-red-600 px-3 py-1 rounded">拒絕</button>
                </div>
              </div>
            )
          );
        })
      ) : (
        <p className="text-gray-400">目前沒有新的邀請</p>
      )}

      <h2 className="text-xl font-bold text-white">好友清單</h2>
      {friends.length > 0 ? (
        friends.map(f => (
          <div key={f.id} className="flex items-center gap-3 bg-gray-700 p-3 rounded">
            <img src={f.avatarUrl} alt={f.name} className="w-10 h-10 rounded-full" />
            <div>
              <h3>{f.name}</h3>
              <p className="text-sm text-gray-300">等級 {f.level}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">尚無好友</p>
      )}
    </div>
  );
};

export default FriendsListPage;
