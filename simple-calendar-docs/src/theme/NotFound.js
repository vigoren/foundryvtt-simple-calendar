import React, {useEffect} from 'react';
import NotFound from '@theme-original/NotFound';

export default function NotFoundWrapper(props) {

    useEffect(() => {
        const currentURL = window.location.href.replace('.html', '');

        //Global Config Index Page
        if(currentURL.endsWith('/pages/global-configuration')){
            window.location.href = '/docs/category/global-configuration/' + window.location.search + window.location.hash;
        }
        //Calendar Config Index Page
        if(currentURL.endsWith('/pages/calendar-configuration')){
            window.location.href = '/docs/category/calendar-configuration/' + window.location.search + window.location.hash;
        }
        //Using SC Index Page
        if(currentURL.endsWith('/pages/docs/using-sc')){
            window.location.href = '/docs/category/using-simple-calendar/' + window.location.search + window.location.hash;
        }
        //API
        if(currentURL.endsWith('/modules/SimpleCalendar.Hooks')){
            window.location.href = '/docs/developing-with-sc/api/namespaces/SimpleCalendar.Hooks' + window.location.search + window.location.hash;
        }
        if(currentURL.endsWith('/modules/SimpleCalendar.api')){
            window.location.href = '/docs/developing-with-sc/api/namespaces/SimpleCalendar.api' + window.location.search + window.location.hash;
        }
        //API Types
        if(currentURL.includes('/types/')){
            const hash = currentURL.substring(currentURL.lastIndexOf('.'));
            const hashRegex = new RegExp(`${hash}$`);
            window.location.href = currentURL.replace('/types/', `/docs/developing-with-sc/api/namespaces/`).replace(hashRegex, '') + hash.replace('.', '#').toLowerCase();
        }
        //API Enums
        if(currentURL.includes('/enums/')){
            window.location.href = currentURL.replace('/enums/', '/docs/developing-with-sc/api/enums/');
        }
        //API interfaces
        if(currentURL.includes('/interfaces/')){
            window.location.href = currentURL.replace('/interfaces/', '/docs/developing-with-sc/api/interfaces/');
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
