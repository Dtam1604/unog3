# UNO Trực Tuyến

Một game UNO trực tuyến được xây dựng với React, TypeScript, Node.js và Socket.IO.

## 🚀 Tính năng

- **Nhiều người chơi trực tuyến**: Chơi với bạn bè trên các máy tính khác nhau qua internet
- **Giao tiếp thời gian thực**: Sử dụng WebSocket để đồng bộ game real-time
- **Hệ thống phòng**: Tạo và tham gia phòng với mật khẩu tùy chọn
- **Lá bài UNO nâng cao**: Bao gồm các lá bài mới như Đổi bài, Rút trừ 2, Xáo trộn, Chặn tất cả
- **Thiết kế responsive**: Giao diện đẹp, tương thích mọi thiết bị
- **AI Players**: Chơi với AI khi không đủ người

## 🛠️ Công nghệ sử dụng

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Socket.IO Client
- Lucide React (biểu tượng)
- Vite

### Backend
- Node.js + Express
- Socket.IO Server
- Hỗ trợ CORS
- UUID cho ID duy nhất

## 📦 Cài đặt

### 1. Sao chép repository
```bash
git clone https://github.com/Dtam1604/unog3.git
cd uno-online-game
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Tạo file môi trường
```bash
cp .env.example .env
```

### 4. Chạy ứng dụng

#### Chạy cả frontend và backend cùng lúc:
```bash
npm run dev:full
```

#### Hoặc chạy riêng biệt:

**Backend (Server):**
```bash
npm run server
```

**Frontend (Client):**
```bash
npm run dev
```

## 🌐 Truy cập

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Kiểm tra sức khỏe**: http://localhost:3001/api/health

## 🎮 Cách chơi

### 1. Tạo phòng
- Nhấn "Tạo Phòng Mới"
- Đặt tên phòng và tên người chơi
- Chọn số người chơi tối đa (2-8)
- Tùy chọn đặt mật khẩu

### 2. Tham gia phòng
- Nhấn "Tham Gia Phòng"
- Chọn phòng từ danh sách hoặc nhập ID phòng
- Nhập tên và mật khẩu (nếu có)

### 3. Bắt đầu game
- Chủ phòng đợi tất cả người chơi sẵn sàng
- Nhấn "Bắt Đầu Game" để khởi động

### 4. Luật chơi UNO
- Ghép bài theo màu, số hoặc ký hiệu
- Sử dụng lá bài hành động một cách chiến thuật
- Gọi "UNO" khi còn 1 lá bài
- Người đầu tiên hết bài thắng cuộc

## 🃏 Các lá bài đặc biệt

### Lá bài cơ bản
- **Bỏ qua**: Bỏ qua lượt người tiếp theo
- **Đảo chiều**: Đảo chiều chơi
- **Rút 2**: Người tiếp theo rút 2 lá
- **Đổi màu**: Đổi màu
- **Đổi màu Rút 4**: Đổi màu + người tiếp theo rút 4 lá

### Lá bài mới
- **Đổi bài**: Đổi bài với người chơi khác
- **Rút trừ 2**: Người tiếp theo bỏ 2 lá hoặc rút 2 lá
- **Xáo trộn**: Bỏ tất cả bài và rút lại
- **Chặn tất cả**: Chỉ cho phép đánh lá số trong lượt tiếp theo

## 🔧 Cấu hình

### Biến môi trường
```env
VITE_SERVER_URL=http://localhost:3001
PORT=3001
```

### Cấu hình CORS
Server được cấu hình để chấp nhận kết nối từ:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Cổng thay thế)

## 🚀 Triển khai

### Frontend
```bash
npm run build
```

### Backend
```bash
npm run server
```

### Docker (Tùy chọn)
Có thể tạo Dockerfile để triển khai dễ dàng hơn.

## 🐛 Khắc phục sự cố

### Lỗi kết nối
- Kiểm tra server đang chạy trên cổng 3001
- Kiểm tra cấu hình CORS
- Kiểm tra cài đặt tường lửa

### Lỗi WebSocket
- Đảm bảo trình duyệt hỗ trợ WebSocket
- Kiểm tra proxy/tường lửa không chặn WebSocket

### Lỗi phòng không đồng bộ
- Server sẽ tự động dọn dẹp phòng cũ sau 30 phút
- Làm mới trang để kết nối lại

## 📝 API Endpoints

### REST API
- `GET /api/rooms` - Lấy danh sách phòng
- `GET /api/health` - Kiểm tra sức khỏe

### WebSocket Events
- `create-room` - Tạo phòng mới
- `join-room` - Tham gia phòng
- `leave-room` - Rời phòng
- `start-game` - Bắt đầu game
- `toggle-ready` - Thay đổi trạng thái sẵn sàng

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit thay đổi
4. Push to branch
5. Tạo Pull Request

## 📄 Giấy phép

MIT License - xem file LICENSE để biết thêm chi tiết.