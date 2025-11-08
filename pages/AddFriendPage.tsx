import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../components/icons/ActionIcons';

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

interface SearchableUser {
  id: number;
  name: string;
  avatarUrl: string;
  level: number;
  isFriend: boolean;
  requestStatus: 'none' | 'sent' | 'received';
}

const AddFriendPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<SearchableUser[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // 初始化假資料（第一次進來時）
    const usersData = localStorage.getItem('users');
    const profileData = localStorage.getItem('userProfile');

    if (!usersData) {
      const mockUsers: UserProfile[] = [
        {
          id: 1,
          name: '你自己',
          avatarUrl: 'https://i.pravatar.cc/100?img=11',
          level: 5,
          friendCode: 'GANBOO-A1B2',
          friends: [],
          friendRequests: [],
          outgoingRequests: [],
        },
        {
          id: 2,
          name: '小明',
          avatarUrl: 'https://i.pravatar.cc/100?img=12',
          level: 4,
          friendCode: 'GANBOO-MING88',
          friends: [],
          friendRequests: [],
          outgoingRequests: [],
        },
        {
          id: 3,
          name: '小美',
          avatarUrl: 'https://i.pravatar.cc/100?img=13',
          level: 6,
          friendCode: 'GANBOO-MEI99',
          friends: [],
          friendRequests: [],
          outgoingRequests: [],
        },
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));
      localStorage.setItem('userProfile', JSON.stringify(mockUsers[0]));
      setAllUsers(mockUsers);
      setCurrentUser(mockUsers[0]);
    } else {
      setAllUsers(JSON.parse(usersData));
      setCurrentUser(profileData ? JSON.parse(profileData) : null);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm.trim() || !currentUser || allUsers.length === 0) {
      setResults([]);
      return;
    }

    const searchable = allUsers
      .filter(u => String(u.id) !== String(currentUser.id))
      .filter(u => u.friendCode.toLowerCase().includes(searchTerm.toLowerCase()))
      .map(u => {
        const requestStatus: 'none' | 'sent' | 'received' =
          currentUser.outgoingRequests.includes(u.id)
            ? 'sent'
            : u.friendRequests.some(req => req.from === currentUser.id)
            ? 'sent'
            : currentUser.friendRequests.some(req => req.from === u.id)
            ? 'received'
            : 'none';

        return {
          id: u.id,
          name: u.name,
          avatarUrl: u.avatarUrl,
          level: u.level,
          isFriend: currentUser.friends.includes(u.id),
          requestStatus,
        };
      });

    setResults(searchable);
  }, [searchTerm, allUsers, currentUser]);

  const handleSendRequest = (friendId: number) => {
    if (!currentUser) return;
    const recipient = allUsers.find(u => u.id === friendId);
    if (!recipient) return;

    // 更新資料
    const updatedRecipient: UserProfile = {
      ...recipient,
      friendRequests: [
        ...recipient.friendRequests,
        { from: currentUser.id, timestamp: new Date().toISOString() },
      ],
    };

    const updatedCurrentUser: UserProfile = {
      ...currentUser,
      outgoingRequests: [...currentUser.outgoingRequests, friendId],
    };

    const updatedAll = allUsers.map(u => {
      if (u.id === friendId) return updatedRecipient;
      if (u.id === currentUser.id) return updatedCurrentUser;
      return u;
    });

    // 儲存
    localStorage.setItem('users', JSON.stringify(updatedAll));
    localStorage.setItem('userProfile', JSON.stringify(updatedCurrentUser));

    setAllUsers(updatedAll);
    setCurrentUser(updatedCurrentUser);
    setSuccessMessage(`已向 ${recipient.name} 送出好友邀請！`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const renderActionButton = (user: SearchableUser) => {
    if (user.isFriend) return <button disabled>✅ 已是好友</button>;
    if (user.requestStatus === 'sent')
      return <button disabled>📤 邀請已送出</button>;
    if (user.requestStatus === 'received')
      return (
        <button onClick={() => navigate('/friends-list')}>💌 回應邀請</button>
      );
    return (
      <button onClick={() => handleSendRequest(user.id)}>➕ 送出邀請</button>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="text-gray-400">
        ← 返回
      </button>
      <input
        type="text"
        placeholder="輸入好友ID（如 GANBOO-MING88）"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-white"
      />
      {successMessage && (
        <div className="bg-green-700 text-white p-2 rounded">{successMessage}</div>
      )}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map(u => (
            <div key={u.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
              <div className="flex items-center gap-3">
                <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3>{u.name}</h3>
                  <p className="text-sm text-gray-300">等級 {u.level}</p>
                </div>
              </div>
              {renderActionButton(u)}
            </div>
          ))
        ) : (
          <p className="text-gray-400">找不到符合的好友</p>
        )}
      </div>
    </div>
  );
};

export default AddFriendPage;
