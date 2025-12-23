import { motion } from 'framer-motion';
import { HiAcademicCap, HiColorSwatch, HiStar, HiUsers } from 'react-icons/hi';

const About = () => {
  const stats = [
    { icon: <HiColorSwatch />, value: '150+', label: 'Original Works' },
    { icon: <HiStar />, value: '25+', label: 'Awards Won' },
    { icon: <HiUsers />, value: '500+', label: 'Happy Clients' },
    { icon: <HiAcademicCap />, value: '100+', label: 'Students Taught' },
  ];

  return (
    <section className="section bg-dark-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800"
                alt="Artist at work"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-primary 
                          rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              About the Artist
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-semibold mt-2 mb-6">
              Creating Art That <br />
              <span className="text-gradient">Speaks to the Soul</span>
            </h2>
            <div className="space-y-4 text-light-300 mb-8">
              <p>
                As a fine art artist specializing in portrait painting, I've dedicated 
                my life to capturing the essence of human emotion on canvas. Each 
                brushstroke is a conversation between the subject and the viewer, 
                revealing stories that words cannot express.
              </p>
              <p>
                With over a decade of experience and numerous international competitions 
                under my belt, I continue to push the boundaries of traditional 
                portraiture while honoring the classical techniques that have inspired 
                artists for centuries.
              </p>
              <p>
                When I'm not painting, I share my passion as an art instructor, 
                helping aspiring artists discover their unique voice and master the 
                craft of fine art.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-primary/10 
                               flex items-center justify-center text-primary text-xl">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-display font-semibold text-light">
                    {stat.value}
                  </div>
                  <div className="text-xs text-dark-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
