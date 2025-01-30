import React from 'react'
import Link from 'next/link'
const handleCloseSidebarClick = () => {
    document.querySelector('.nav-menu-btn-container').style.right = '-310px';
  };
  const handleHamburgMenuClick = () => {
    document.querySelector('.nav-menu-btn-container').style.right = '0';
  };
const Nav = () => {
    return (
        <div>
            <nav>
                <img className="back-shadow nav-shadow" src="/assets/nav-shadow.svg" alt="" />

                <Link href="/"><img className="header-logo" src="/assets/logo-header.png" alt="" /></Link>
                <svg className="hamburg-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleHamburgMenuClick}>
                    <path d="M3 6H21M3 12H21M3 18H21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div className="nav-menu-btn-container">
                    <span className="close-sidebar" onClick={handleCloseSidebarClick}>&times;</span>
                    <ul>
                        <li><a href="#" className="active-tab">Home</a></li>
                        <li><a href="#benefit-section">Benefits</a></li>
                        <li><a href="#pricing-section">Pricing</a></li>
                        <li><a href="#faq-section">FAQ’s</a></li>
                        <li><a href="#contact-section">Contact</a></li>
                    </ul>
                    <div className="nav-btn-container">
                        {/* <button onClick={() => navigate('/login')}>Login</button> */}
                        <Link href="/Login" className='linkLogin' >Login</Link>
                        <a className="no-dec" href="#pricing-section">
                            <button className="get-started">
                                Get Started
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 8L22 12M22 12L18 16M22 12H2" stroke="#EEEEEE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav
