'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '@/config';

const apiUrl = config.apiUrl;
const stripePublishableKey = config.stripePublishableKey;

const Sidebar = ({ setActiveAccount, activeAccount, refreshTrigger }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [userPlan, setUserPlan] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const activeAccountRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchAccountDetails = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/auth/ad_account/${id}`, { withCredentials: true });
      setAdAccountDetails(res.data);
    } catch (error) {
      toast.error('Error fetching account details');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPlanRes = await axios.get(`${apiUrl}/payment/user-subscription-status`, { withCredentials: true });
        setUserPlan(userPlanRes.data.plan);

        const accountsRes = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        setAdAccounts(accountsRes.data.ad_accounts);

        const savedAccount = JSON.parse(localStorage.getItem('activeAccount') || 'null');
        if (savedAccount && accountsRes.data.ad_accounts.some(acc => acc.id === savedAccount.id)) {
          setActiveAccount(savedAccount);
          fetchAccountDetails(savedAccount.id);
        } else if (accountsRes.data.ad_accounts.length > 0) {
          setActiveAccount(accountsRes.data.ad_accounts[0]);
          fetchAccountDetails(accountsRes.data.ad_accounts[0].id);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        toast.error('Error fetching accounts or plan');
      }
    };
    fetchData();
  }, [refreshTrigger, pathname]);

  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem('activeAccount', JSON.stringify(activeAccount));
    }
  }, [activeAccount]);

  const handleAccountClick = (index) => {
    setActiveAccount(adAccounts[index]);
    fetchAccountDetails(adAccounts[index].id);
  };

  const handleUpgradeClick = () => {
    router.push('/pricing-section');
  };

  const handleAddAccountClick = async () => {
    try {
      const res = await axios.post(`${apiUrl}/payment/add_ad_account`, {}, { withCredentials: true });
      if (res.status === 200) {
        window.Stripe(stripePublishableKey).redirectToCheckout({ sessionId: res.data.sessionId });
      }
    } catch (error) {
      toast.error('Error adding account');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading accounts</div>;

  return (
    <div>
      <div className="menu-icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <img src={isSidebarOpen ? '/assets/x.svg' : '/assets/menu.svg'} alt="Menu" />
      </div>
      {isSidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="logo">
            <a href="/">
              <img src="/assets/logo.png" alt="Logo" className="logo-img" />
            </a>
          </div>
          <hr />
          <div className="accounts">
            {adAccounts.length > 0 ? (
              adAccounts.map((account, index) => (
                <button
                  key={index}
                  ref={activeAccount?.id === account.id ? activeAccountRef : null}
                  className={`account-btn ${activeAccount?.id === account.id ? 'active' : ''}`}
                  onClick={() => handleAccountClick(index)}
                >
                  <img src="/assets/user.png" alt="User" className="icon" /> Ad Account {index + 1}
                </button>
              ))
            ) : (
              <p>No accounts available</p>
            )}
          </div>
          <hr />
          {userPlan === 'Enterprise' && (
            <button className="add-account-btn" onClick={handleAddAccountClick}>Add New Account</button>
          )}
          <div className="dropdown">
            <div className="dropdown-header" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <span>Facebook Settings</span>
              <img src="/assets/chevron.png" alt="Toggle" className={isDropdownOpen ? 'rotated' : ''} />
            </div>
            {isDropdownOpen && activeAccount && (
              <div className="dropdown-content">
                <div className="row">
                  <span>Ad Account - </span>
                  <input className="input" value={adAccountDetails.name || ''} readOnly />
                </div>
                <hr />
              </div>
            )}
          </div>
        </div>
        <div>
          <button className="upgrade-btn" onClick={handleUpgradeClick}>Upgrade Plan</button>
          <div className="footer">
            {adAccounts.length} Ad account(s) on {userPlan.toLowerCase()} plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
