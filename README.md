# Mini Food Ordering System - UI

Giao diện cho hệ thống đặt món ăn nội bộ theo kiến trúc dịch vụ (ShopeeFood mini). UI gọi REST API từ các service backend để xử lý đăng nhập, xem món, giỏ hàng, đặt hàng và thanh toán.

## Thành viên

- Trần Long Vũ (22717471)
- Hồ Quang Nhân (22715701)

## Tính năng

- Xác thực: đăng ký, đăng nhập
- Danh sách món: xem menu
- Giỏ hàng: thêm/xóa món
- Đơn hàng: tạo đơn
- Thanh toán: chọn COD hoặc Banking và cập nhật trạng thái
- Thông báo: hiển thị trạng thái thành công sau thanh toán

## Công nghệ

- ReactJS + TypeScript
- Vite
- Axios

## Cấu trúc dự án

- Pages: login, register, dashboard, admin users
- Components: food list, cart, checkout, notifications
- Services: auth, food, order, payment, admin

## Cài đặt

```bash
npm install
```

## Chạy

```bash
npm run dev
```

## Ghi chú

- Cấu hình base URL trong các service frontend trỏ đến IP LAN thật của backend.
- Không dùng localhost chéo máy; cấu hình CORS phía backend để cho phép host của UI.
