import { motion } from 'framer-motion';
import { HiAcademicCap, HiColorSwatch, HiStar, HiGlobe } from 'react-icons/hi';
import profileImage from '../../assets/profile.jpeg';

const About = () => {
  const stats = [
    { icon: <HiColorSwatch />, value: '50+', label: 'Original Works' },
    { icon: <HiStar />, value: '10+', label: 'Exhibitions' },
    { icon: <HiGlobe />, value: 'National', label: '& International' },
    { icon: <HiAcademicCap />, value: 'Pagoda', label: 'Institute' },
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
                src={profileImage}
                alt="Sujan Budhathoki - Visual Artist"
                className="w-full h-full object-cover object-top"
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
              Sujan Budhathoki <br />
              <span className="text-gradient">Visual Artist</span>
            </h2>
            <div className="space-y-4 text-light-300 mb-8">
              <p>
                A young and emerging visual artist of Nepal, I received my training 
                from the prestigious <strong className="text-primary">Pagoda Institute of Fine Art</strong>, 
                under the guidance of renowned Artist <strong className="text-light">Roshan Pradhan</strong>, 
                where I continue to be an active member.
              </p>
              <p>
                I am known for my poetic depiction of inner conscience and 
                contemporary conceptual thoughts in my works. There's a saying that 
                an artist speaks with his work rather than words — a philosophy that 
                is deeply embodied in everything I create.
              </p>
              <p>
                I have participated in various <strong className="text-light">national and international 
                art exhibitions</strong>, continuously pushing the boundaries of visual 
                expression while staying true to my artistic vision.
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
