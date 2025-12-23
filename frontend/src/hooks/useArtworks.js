import { useState, useEffect, useCallback } from 'react';
import { artworksAPI } from '../services/api';

export const useArtworks = (initialParams = {}) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState(initialParams);

  const fetchArtworks = useCallback(async (newParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await artworksAPI.getAll({ ...params, ...newParams });
      setArtworks(response.data.data);
      setPagination(response.data.pagination || {});
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const refetch = () => fetchArtworks();

  return {
    artworks,
    loading,
    error,
    pagination,
    total,
    params,
    updateParams,
    refetch,
  };
};

export const useFeaturedArtworks = (limit = 6) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await artworksAPI.getFeatured(limit);
        setArtworks(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch featured artworks');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [limit]);

  return { artworks, loading, error };
};

export const useArtwork = (id) => {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchArtwork = async () => {
      try {
        const response = await artworksAPI.getById(id);
        setArtwork(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch artwork');
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  return { artwork, loading, error };
};
