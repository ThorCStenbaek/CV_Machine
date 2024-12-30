import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {

    return (
        <footer>
            <div className="footer" style={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", padding: '10px', textAlign: 'center'}}>
                <div className="footer-content">
                    <p style={{fontSize: '16px'}}> PYCIPEDIA – Skapad av och för socialarbetare. Besök <span>{" "}</span>
                        <Link to="/about" style={{ textDecoration: 'none', color: 'black' }}>Pycipedia.se/about</Link>
                        <span>{" "}</span>
                         för mer information.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;