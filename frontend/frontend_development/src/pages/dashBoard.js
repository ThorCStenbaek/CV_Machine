import React, { useState } from 'react';
import styles from "./../css/pages/Dashboard.module.css"
import { YourCVs } from './dashBoard/YourCVs';
const menuItems = ['CVs', 'Settings', 'Help'];

const Dashboard= ({}) => {
  const [activePage, setActivePage] = useState('CVs');

  const renderContent = () => {
    switch (activePage) {
      case 'CVs':
        return <YourCVs/>;
      case 'Settings':
        return <div><h2>Settings</h2><p>Settings page is under construction.</p></div>;
      case 'Help':
        return <div><h2>Help</h2><p>Help section coming soon.</p></div>;
      default:
        return <div><h2>Unknown</h2></div>;
    }
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <h1 className={styles.logo}>MyApp</h1>
        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setActivePage(item)}
              className={`${styles.menuItem} ${
                activePage === item ? styles.active : ''
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <main className={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
