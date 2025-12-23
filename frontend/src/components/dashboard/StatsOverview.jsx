import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph, HiEye, HiCurrencyDollar, HiTag } from 'react-icons/hi';
import { artworksAPI, categoriesAPI } from '../../services/api';

const StatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, catsRes] = await Promise.all([
          artworksAPI.getStats(),
          categoriesAPI.getAll(),
        ]);
        setStats(statsRes.data.data);
        setCategories(catsRes.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      icon: <HiPhotograph />,
      label: 'Total Artworks',
      value: stats?.totalArtworks || 0,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: <HiEye />,
      label: 'Total Views',
      value: stats?.totalViews || 0,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      icon: <HiCurrencyDollar />,
      label: 'For Sale',
      value: stats?.forSale || 0,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: <HiTag />,
      label: 'Categories',
      value: categories.length,
      color: 'bg-purple-500/10 text-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-dark-100 rounded-xl p-6 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-dark-200 mb-4" />
            <div className="h-8 bg-dark-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-dark-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-100 rounded-xl p-6"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center 
                          justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-display font-semibold text-light mb-1">
              {stat.value.toLocaleString()}
            </p>
            <p className="text-sm text-dark-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Medium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-100 rounded-xl p-6"
        >
          <h3 className="text-lg font-display font-semibold text-light mb-4">
            Artworks by Medium
          </h3>
          <div className="space-y-3">
            {stats?.byMedium?.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-light-300 capitalize">{item._id || 'Unknown'}</span>
                  <span className="text-light">{item.count}</span>
                </div>
                <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.count / stats.totalArtworks) * 100}%`,
                    }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-dark-100 rounded-xl p-6"
        >
          <h3 className="text-lg font-display font-semibold text-light mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/dashboard/artworks/new"
              className="p-4 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors 
                       flex flex-col items-center text-center"
            >
              <HiPhotograph className="text-3xl text-primary mb-2" />
              <span className="text-sm text-light">Add Artwork</span>
            </a>
            <a
              href="/dashboard/categories"
              className="p-4 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors 
                       flex flex-col items-center text-center"
            >
              <HiTag className="text-3xl text-primary mb-2" />
              <span className="text-sm text-light">Manage Categories</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsOverview;
