import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  useEffect(() => {
    let timeout;

    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
        if (window.innerWidth <= 640) {
          setIsMobileVisible(true);
          clearTimeout(timeout);
          timeout = setTimeout(() => setIsMobileVisible(false), 2000); // Hide after 2 seconds
        }
      } else {
        setIsVisible(false);
        setIsMobileVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-4 w-10 h-10 sm:w-16 sm:h-16 bg-orange-900 text-white rounded-full shadow-lg focus:outline-none flex items-center justify-center ${
            isMobileVisible ? '' : 'hidden sm:flex'
          }`}
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-sm sm:text-xl" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
