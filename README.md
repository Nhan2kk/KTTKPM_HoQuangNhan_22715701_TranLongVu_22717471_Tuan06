# 🍽️ Food Delivery Management System

**Hệ thống quản lý và đặt thức ăn trực tuyến hiện đại**

Ứng dụng React + TypeScript + Vite cho phép người dùng xem, tìm kiếm, quản lý (thêm/sửa/xóa) các món ăn và đặt hàng trực tuyến với giao diện đẹp mắt và dễ sử dụng.

**Phiên bản**: 1.0.0  
**Ngôn ngữ**: TypeScript + React 19  
**Build Tool**: Vite + ESLint

## 📋 Tính năng chính

### 🎯 Quản lý Thực đơn

- ✅ Xem danh sách tất cả các món ăn
- ✅ Tìm kiếm món ăn theo tên
- ✅ Lọc món ăn theo danh mục
- ✅ Xem chi tiết từng món ăn
- ✅ Thêm, chỉnh sửa, xóa các món ăn
- ✅ Chọn số lượng và đặt hàng

### 🛒 Quản lý Giỏ hàng

- ✅ Xem tất cả các món đã đặt
- ✅ Cập nhật số lượng từng món
- ✅ Xóa từng món hoặc xóa tất cả
- ✅ Tính tổng giá tự động
- ✅ Thanh toán đơn hàng

### 🎨 Giao diện

- ✅ Header & Footer chuyên nghiệp
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Gradient Colors & Modern Styling
- ✅ Smooth Animations & Transitions
- ✅ User-friendly Components

---

## 🚀 Quickstart

### Prerequisites

- Node.js 16+
- npm hoặc yarn
- Java 11+
- Maven 3.6+

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start Development Server
npm run dev

# 3. Open browser
http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/              # Page components
│   ├── Food.tsx        # Food list & management
│   ├── FoodDetail.tsx  # Food detail view
│   ├── Cart.tsx        # Shopping cart
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── services/           # API services
│   ├── foodService.ts
│   └── authService.ts
├── styles/             # CSS files
│   ├── header.css
│   ├── footer.css
│   ├── food.css
│   ├── food-detail.css
│   └── cart.css
├── App.tsx             # Root component
├── main.tsx
└── index.css
```

---

## 🔌 API Integration

### Backend Endpoints

**Base URL**: `http://localhost:8080/api/foods`

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| GET    | `/`                   | Get all foods      |
| GET    | `/:id`                | Get food by ID     |
| GET    | `/search?keyword=...` | Search foods       |
| GET    | `/category/:category` | Filter by category |
| POST   | `/`                   | Create new food    |
| PUT    | `/:id`                | Update food        |
| DELETE | `/:id`                | Delete food        |

### Example Request

```typescript
const response = await foodService.getAllFoods();
// Returns: Food[]

const food = await foodService.getFoodById(1);
// Returns: Food

const created = await foodService.createFood({
    name: 'Cơm tấm',
    description: 'Cơm tấm sườn nướng',
    price: 45000,
    imageUrl: '...',
    category: 'Cơm',
    available: true,
});
```

---

## 📱 Pages

### 🍽️ Food List (`/food`)

Danh sách tất cả các món ăn với khả năng:

- Tìm kiếm theo tên
- Lọc theo danh mục
- Xem chi tiết
- Thêm, chỉnh sửa, xóa (CRUD)
- Đặt hàng

### 🔍 Food Detail (`/food/:id`)

Chi tiết một món ăn với:

- Hình ảnh lớn
- Thông tin đầy đủ
- Chọn số lượng
- Thêm vào giỏ hàng

### 🛒 Cart (`/cart`)

Giỏ hàng của bạn với:

- Bảng liệt kê các món
- Cập nhật số lượng
- Xóa các món
- Tính tổng
- Thanh toán

---

## 🎨 Styling

### Color Palette

```
Primary:    #667eea (Purple)
Secondary:  #764ba2 (Dark Purple)
Success:    #27ae60 (Green)
Danger:     #e74c3c (Red)
Info:       #3498db (Blue)
Warning:    #f39c12 (Orange)
```

### Responsive Breakpoints

```
Desktop:  1200px+
Tablet:   768px - 1199px
Mobile:   < 768px
```

---

## 🔐 Authentication

- Login/Register required to access
- JWT Token stored in localStorage
- Private routes protection
- CORS enabled

---

## 📦 Dependencies

```json
{
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.5",
    "typescript": "~6.0.2",
    "vite": "^8.0.4"
}
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 📚 Documentation

- [FOOD_MANAGEMENT_README.md](./FOOD_MANAGEMENT_README.md) - Hướng dẫn chi tiết
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn cài đặt
- [FILE_SUMMARY.md](./FILE_SUMMARY.md) - Tóm tắt các file

---

## 💡 Usage Tips

1. **Đầu tiên**: Đăng ký tài khoản hoặc đăng nhập
2. **Vào Menu**: Xem danh sách tất cả các món ăn (`/food`)
3. **Tìm kiếm**: Sử dụng tính năng tìm kiếm hoặc lọc danh mục
4. **Xem chi tiết**: Nhấp vào bất kỳ món ăn nào để xem chi tiết
5. **Đặt hàng**: Chọn số lượng và thêm vào giỏ hàng
6. **Thanh toán**: Đi đến giỏ hàng và thanh toán

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Change port in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### CORS Error

- Ensure backend is running on port 8080
- Check CORS is enabled in backend

### Images not loading

- Check image URLs are valid
- Fallback placeholder will be shown

---

## 👥 Team

- **Hồ Quang Nhân** (22715701)
- **Trần Long Vũ** (22717471)

---

## 📄 License

This project is part of the Software Architecture course (KTTKPM).

---

**Happy Coding! 🚀**
