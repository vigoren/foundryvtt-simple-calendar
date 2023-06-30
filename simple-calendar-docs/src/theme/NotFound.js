import React, {useEffect} from 'react';
import NotFound from '@theme-original/NotFound';

export default function NotFoundWrapper(props) {

    useEffect(() => {
        const currentURL = window.location.href.replace('.html', '');
        //API Types
        if(currentURL.includes('/types/')){
            const hash = currentURL.substring(currentURL.lastIndexOf('.'));
            const hashRegex = new RegExp(`${hash}$`);
            window.location.href = currentURL.replace('/types/', `/docs/developing-with-sc/api/namespaces/`).replace(hashRegex, '') + hash.replace('.', '#').toLowerCase();
        }
        //API Functions
        if(currentURL.includes('/functions/')){
            const hash = currentURL.substring(currentURL.lastIndexOf('.'));
            const hashRegex = new RegExp(`${hash}$`);
            window.location.href = currentURL.replace('/functions/', `/docs/developing-with-sc/api/namespaces/`).replace(hashRegex, '') + hash.replace('.', '#').toLowerCase();
        }
        //API Variables
        if(currentURL.includes('/variables/')){
            const hash = currentURL.substring(currentURL.lastIndexOf('.'));
            const hashRegex = new RegExp(`${hash}$`);
            window.location.href = currentURL.replace('/variables/', `/docs/developing-with-sc/api/namespaces/`).replace(hashRegex, '') + hash.replace('.', '#').toLowerCase();
        }

    });

  return (
    <>
      <NotFound {...props} />
    </>
  );
}
