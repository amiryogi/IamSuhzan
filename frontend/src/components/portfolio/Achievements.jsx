import { motion } from 'framer-motion';
import { HiBadgeCheck, HiStar, HiCalendar } from 'react-icons/hi';

const Achievements = () => {
  const achievements = [
    {
      year: 2024,
      title: 'National Portrait Competition',
      award: 'First Place',
      description: 'Awarded for exceptional portrait composition and technique',
      type: 'gold',
    },
    {
      year: 2023,
      title: 'International Art Festival',
      award: 'Best in Show',
      description: 'Featured as the standout piece among 500+ entries',
      type: 'gold',
    },
    {
      year: 2023,
      title: 'Regional Fine Arts Exhibition',
      award: 'Silver Medal',
      description: 'Recognition for innovative approach to classical portraiture',
      type: 'silver',
    },
    {
      year: 2022,
      title: 'Contemporary Art Awards',
      award: 'Featured Artist',
      description: 'Selected as one of 10 emerging artists to watch',
      type: 'featured',
    },
    {
      year: 2022,
      title: 'Portrait Masters Salon',
      award: 'Finalist',
      description: 'Top 50 global selection from 3000+ submissions',
      type: 'bronze',
    },
    {
      year: 2021,
      title: 'Art Excellence Awards',
      award: 'Bronze Medal',
      description: 'Recognized for mastery of oil painting techniques',
      type: 'bronze',
    },
  ];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'gold':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-dark';
      case 'silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-dark';
      case 'bronze':
        return 'bg-gradient-to-r from-amber-700 to-amber-800 text-light';
      case 'featured':
        return 'bg-gradient-to-r from-primary to-primary-dark text-dark';
      default:
        return 'bg-dark-300 text-light';
    }
  };

  return (
    <section className="section bg-dark">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Recognition
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mt-2 mb-4">
            Awards & Achievements
          </h2>
          <p className="text-light-300 max-w-2xl mx-auto">
            A journey of growth, recognition, and dedication to the art of 
            portrait painting.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex gap-6 pb-8 last:pb-0"
            >
              {/* Timeline Line */}
              <div className="absolute left-[27px] top-12 bottom-0 w-0.5 bg-dark-300" />
              
              {/* Year Badge */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-dark-200 border-2 border-primary 
                             flex items-center justify-center">
                  <HiBadgeCheck className="text-primary text-xl" />
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-dark-100 rounded-xl p-6 hover:bg-dark-200 
                           transition-colors group">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-light 
                                group-hover:text-primary transition-colors">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-dark-400 mt-1">
                      <HiCalendar />
                      <span>{achievement.year}</span>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getTypeStyles(achievement.type)}`}>
                    <HiStar className="inline mr-1" />
                    {achievement.award}
                  </span>
                </div>
                <p className="text-light-300 text-sm">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
