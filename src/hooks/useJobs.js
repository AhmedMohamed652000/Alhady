import { useState, useEffect } from 'react';
import api from '../utils/api';

const useJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/jobs');
            if (response.data && response.data.success) {
                setJobs(response.data.data);
            } else {
                setError('Failed to fetch jobs');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return { jobs, loading, error, refetch: fetchJobs };
};

export default useJobs;
