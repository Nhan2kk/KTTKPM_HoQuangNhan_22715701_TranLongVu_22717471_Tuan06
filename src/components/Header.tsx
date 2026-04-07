import type { ReactNode } from 'react';
import '../styles/header.css';

interface HeaderProps {
    children?: ReactNode;
}

function Header({ children }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <h1>🍽️ Food Delivery</h1>
                </div>
                <nav className="header-nav">
                    <a href="/dashboard">Trang chủ</a>
                    <a href="/food">Menu</a>
                    <a href="/cart">Giỏ hàng</a>
                    <a href="/profile">Hồ sơ</a>
                </nav>
                {children && <div className="header-content">{children}</div>}
            </div>
        </header>
    );
}

export default Header;
