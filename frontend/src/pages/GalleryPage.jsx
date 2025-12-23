import Gallery from '../components/portfolio/Gallery';

const GalleryPage = () => {
  return (
    <div className="pt-24">
      <Gallery limit={24} showFilters={true} />
    </div>
  );
};

export default GalleryPage;
