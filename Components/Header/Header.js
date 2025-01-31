"use client"
import React, { useState } from "react";
import Image from "next/image";
const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="header">
            <nav className="nav">
                <div className="menu" id="menuBtn">
                    <Image src="/assets/Vector2.png" alt="menu" width={20} height={20} />
                </div>
                <div className="profile" onClick={toggleDropdown}>
                    <Image src="/assets/no-profile-picture-15257.svg" alt="Profile" width={40} height={40} id="profile" />
                    <div className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                        <div className="dropdown-item1">Active Ad Accounts: 10</div>
                        <div className="dropdown-item" onClick={() => window.location.href = '/ProfileModule.html'}>Manage Subscription</div>
                        <div className="dropdown-item">Log Out</div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
