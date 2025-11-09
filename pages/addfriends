// 輸入好友名稱，從 Google Sheets 搜尋並顯示
const SPREADSHEET_API = "https://script.google.com/macros/s/AKfycbzXFd71J4tBmBkCBIjglBaaFmhrXBnDFAh3wdEJ3gmGFOTu5ivgRYbXAN7LPspZojPB/exec";

async function searchFriends(keyword) {
  const res = await fetch(`${SPREADSHEET_API}?name=${encodeURIComponent(keyword)}`);
  const data = await res.json();
  return data;
}

// 即時互動
const input = prompt("輸入好友名稱搜尋：");
const results = await searchFriends(input);

if (results.length === 0) {
  console.log("找不到好友。");
} else {
  console.log("搜尋結果：");
  results.forEach(user => {
    console.log(`${user.name} (ID: ${user.id})`);
  });
});
