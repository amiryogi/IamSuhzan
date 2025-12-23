import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiUserGroup, HiClock, HiCheck } from 'react-icons/hi';

const Services = () => {
  const services = [
    {
      icon: <HiAcademicCap />,
      title: 'One-on-One Lessons',
      description: 'Personalized art instruction tailored to your skill level and goals.',
      features: [
        'Customized curriculum',
        'Flexible scheduling',
        'All skill levels welcome',
        'Materials guidance',
      ],
      price: 'Rs 1500/hour',
    },
    {
      icon: <HiUserGroup />,
      title: 'Group Workshops',
      description: 'Join fellow artists in an inspiring group learning environment.',
      features: [
        'Small groups (4-8 students)',
        'Monthly themes',
        'Live demonstrations',
        'Peer feedback sessions',
      ],
      price: 'Rs 1500/session',
      popular: true,
    },
    {
      icon: <HiClock />,
      title: 'Portrait Commissions',
      description: 'Custom portrait paintings created from your photos or live sittings.',
      features: [
        'Various sizes available',
        'Choice of medium',
        'Progress updates',
        'Framing options',
      ],
      price: 'From Rs 2000',
    },
  ];

  return (
    <section className="section bg-dark-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mt-2 mb-4">
            Learn & Commission
          </h2>
          <p className="text-light-300 max-w-2xl mx-auto">
            Whether you want to develop your artistic skills or commission a 
            custom portrait, I'm here to help bring your vision to life.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-dark rounded-2xl p-8 border transition-all
                       hover:border-primary group ${
                         service.popular
                           ? 'border-primary shadow-lg shadow-primary/20'
                           : 'border-dark-300'
                       }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 
                             bg-primary text-dark text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center
                           text-primary text-2xl mb-6 group-hover:bg-primary 
                           group-hover:text-dark transition-colors">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-display font-semibold text-light mb-3">
                {service.title}
              </h3>
              <p className="text-light-300 text-sm mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-light-200">
                    <HiCheck className="text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-dark-400 uppercase">Starting at</span>
                  <p className="text-2xl font-display font-semibold text-primary">
                    {service.price}
                  </p>
                </div>
                <Link
                  to="/contact"
                  className={`btn ${
                    service.popular ? 'btn-primary' : 'btn-outline'
                  }`}
                >
                  Inquire
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
