import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddFriendPage from "./pages/AddFriendPage";
import FriendsListPage from "./pages/FriendsListPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddFriendPage />} />
        <Route path="/friends-list" element={<FriendsListPage />} />
      </Routes>
    </BrowserRouter>
  );
}
