import React, { useEffect, useRef } from 'react';

const FadeInSection = (props) => {
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 }
  );

    observer.observe(domRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fade-in-section" ref={domRef}>
      {props.children}
    </div>
  );
};

export default FadeInSection;
