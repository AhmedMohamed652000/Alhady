import { useState, useEffect } from 'react';
import api from '../utils/api';

const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getWithCache('/settings');
        
        let data = null;
        // Handle both wrapped { success: true, data: {...} } and direct {...} responses
        if (res.data.success && res.data.data) {
          data = res.data.data;
        } else if (res.data && res.data._id) {
          // If the data itself has an _id, it's likely the settings object
          data = res.data;
        }
        
        setSettings(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

export default useSettings;
