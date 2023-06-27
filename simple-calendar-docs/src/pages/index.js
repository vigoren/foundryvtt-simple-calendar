import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import FeatureBlock from "@site/src/components/FeatureBlock";
import styles from './index.module.css';

import MonthIcon from '@site/static/img/month-icon.svg';
import CalendarWeek from '@site/static/img/calendar-week.svg';
import Calendar from '@site/static/img/calendar.svg';
import Sun from '@site/static/img/sun.svg';
import Moon from '@site/static/img/moon.svg';
import Reply from '@site/static/img/reply.svg';
import Clock from '@site/static/img/clock.svg';
import Note from '@site/static/img/note.svg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <img className={styles.heroBannerBackground} src="https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/sc-v2-theme-dark.png" alt="Screenshot of a calendar in Simple Clandar" />
      <div className={clsx("container", styles.heroBannerContainer)}>
        <img className={styles.herBannerLogo} src="https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/logo.svg" alt="Simple Clanedar Logo" />
        <h1 className={clsx("hero__title", styles.heroBannerTitle)}>{siteConfig.title}</h1>
        <p className={clsx("hero__subtitle", styles.heroBannerTitle)}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="#get-started">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation for how to configure, use and develop with the Simple Calendar module for FoundryVTT!">
      <HomepageHeader />
      <main>
          <section>
              <div className="container">
                  <div className="row">
                      <div className="col">
                          <h2>Create The Perfect Calendar</h2>
                          <p>Simple Calendar is the ultimate timekeeping module for <a href="https://foundryvtt.com/" target="_blank">FoundryVTT</a> that works with all game systems!</p>
                          <p>It comes prepackaged with many <a href="docs/calendar-configuration/quick-setup">preset calendars</a> to get your world up and running quickly. Or if you have a completely custom-built calendering system for your world, Simple Calendar can handle that as well!</p>
                          <p>Get started and create the perfect calendar to enrich your world for your players!</p>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <FeatureBlock title="Months Your Way" svg={MonthIcon}>
                              <ul>
                                  <li>Your world can have as many months as it needs!</li>
                                  <li><a href="docs/calendar-configuration/month-settings">Customize</a> each month to specify everything from how many days it has, its name to if the month is considered intercalary (falls outside normal months) or not.</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                      <div className="col">
                          <FeatureBlock title="Custom Years" svg={Calendar}>
                              <ul>
                                  <li>Set the current year and add a prefix/postfix.</li>
                                  <li>You can also <a href="docs/calendar-configuration/year-settings#year-names">name each year</a> to give your world a unique touch!</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <FeatureBlock title="Unique Weekdays" svg={CalendarWeek}>
                              <ul>
                                  <li>You set how many days are in a week and customize the name of each weekday!</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                      <div className="col">
                          <FeatureBlock title="Set Your Own Leap Year Rules" svg={Reply}>
                              <ul>
                                  <li>Customize if your world has <a href="docs/calendar-configuration/leap-year-settings">leap years</a> and if so how often they occur.</li>
                                  <li>Set how many days a month has during a leap year. You can even have months only appear or disappear during leap years!</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <FeatureBlock title="Seasons" svg={Sun}>
                              <ul>
                                  <li>Determine how many <a href="docs/calendar-configuration/season-settings">seasons</a> there are in your world.</li>
                                  <li><a href="docs/calendar-configuration/season-settings">Customize</a> their names, when the season starts, and assign an icon and color to make each season unique.</li>
                                  <li>Specify Sunrise and Sunset times for each season and Simple Calendar will do the math to gradually shift those times between season!</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                      <div className="col">
                          <FeatureBlock title="Create Custom Moons" svg={Moon}>
                              <ul>
                                  <li><a href="docs/calendar-configuration/moon-settings">Set up</a> as many moons as your world needs and give it a unique name, cycle length and color.</li>
                                  <li>Go deeper into the settings and <a href="docs/calendar-configuration/moon-settings#phases">customize each phase</a> of the moon!</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <FeatureBlock title="Unique Time? No Problem" svg={Clock}>
                              <ul>
                                  <li><a href="docs/calendar-configuration/time-settings">Customize</a> the number hours in a day, minutes in an hour and seconds in a minute.</li>
                                  <li>Configure how the real time clock interacts with your world, so as seconds pass in the real world time passes in your world!</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                      <div className="col">
                          <FeatureBlock title="Notes and Events" svg={Note}>
                              <ul>
                                  <li>Add <a href="docs/using-sc/notes">notes</a> and events to your calendar so that you never forget an event again.</li>
                                  <li>Specify how often notes can repeat, categorize your notes for easy identification and select who can view each note.</li>
                              </ul>
                          </FeatureBlock>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col col--3"></div>
                      <div className="col">
                          <FeatureBlock title="And much more!" svg="span">
                              <p>There are many ways to customize your calendar and how it interacts with FoundryVTT and other systems and modules. Be sure to check out the full documentation to learn all the way!</p>
                          </FeatureBlock>
                      </div>
                      <div className="col col--3"></div>
                  </div>
              </div>
          </section>
          <section>
              <div className="container">
                  <h2 className="anchor" id="get-started">Get Started<a href="#get-started" className="hash-link" aria-label="Direct link to Get Started" title="Direct link to Get Started">​</a></h2>
              </div>
          </section>
      </main>
    </Layout>
  );
}
