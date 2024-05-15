import React, { useEffect, useRef } from 'react';

const VismeForm = () => {
  const vismeRef = useRef(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
      script.async = true;
      vismeRef.current.appendChild(script);
    };

    loadScript();

    return () => {
      const vismeElement = vismeRef.current;
      while (vismeElement.firstChild) {
        vismeElement.removeChild(vismeElement.firstChild);
      }
    };
  }, []);

  return (
    <div
      className="visme_d h-screen"
      data-title="Untitled Project"
      data-url="01enq7q9-untitled-project?fullPage=true"
      data-domain="forms"
      data-full-page="true"
      data-min-height="100vh"
      data-form-id="66518"
      ref={vismeRef}
    ></div>
  );
};

export default VismeForm;


// import React, { useEffect } from 'react';

// const VismeForm = () => {
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div
//       className="visme_d h-screen"
//       data-title="Untitled Project"
//       data-url="01enq7q9-untitled-project?fullPage=true"
//       data-domain="forms"
//       data-full-page="true"
//       data-min-height="100vh"
//       data-form-id="66518"
//     ></div>
//   );
// };

// export default VismeForm;
