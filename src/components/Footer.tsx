import '../styles/footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Về chúng tôi</h3>
                    <p>
                        Nền tảng đặt thức ăn trực tuyến hàng đầu, cung cấp các
                        món ăn chất lượng cao từ những nhà hàng tốt nhất.
                    </p>
                </div>
                <div className="footer-section">
                    <h3>Liên kết</h3>
                    <ul>
                        <li>
                            <a href="#home">Trang chủ</a>
                        </li>
                        <li>
                            <a href="#menu">Menu</a>
                        </li>
                        <li>
                            <a href="#contact">Liên hệ</a>
                        </li>
                        <li>
                            <a href="#about">Về chúng tôi</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <p>Email: support@fooddelivery.com</p>
                    <p>Điện thoại: 1900-1234</p>
                    <p>Địa chỉ: 123 Đường ABC, TP. HCM</p>
                </div>
                <div className="footer-section">
                    <h3>Mạng xã hội</h3>
                    <div className="social-links">
                        <a href="#facebook">Facebook</a>
                        <a href="#twitter">Twitter</a>
                        <a href="#instagram">Instagram</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Food Delivery. Bản quyền được bảo vệ.</p>
            </div>
        </footer>
    );
}

export default Footer;
