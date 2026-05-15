import { useState, useEffect } from 'react';
import api from '../utils/api';

const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.getWithCache('/reviews');
        
        let data = [];
        if (res.data.success && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (Array.isArray(res.data)) {
          data = res.data;
        }
        
        // Only show active reviews and sort by order
        const activeReviews = data
          .filter(review => review.active !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setReviews(activeReviews);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
};

export default useReviews;
