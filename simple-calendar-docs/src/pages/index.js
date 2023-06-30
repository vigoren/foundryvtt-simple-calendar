import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import FeatureBlock from "@site/src/components/FeatureBlock";
import styles from './index.module.css';
import Admonition from '@theme/Admonition';

import MonthIcon from '@site/static/img/month-icon.svg';
import CalendarWeek from '@site/static/img/calendar-week.svg';
import Calendar from '@site/static/img/calendar.svg';
import Sun from '@site/static/img/sun.svg';
import Moon from '@site/static/img/moon.svg';
import Reply from '@site/static/img/reply.svg';
import Clock from '@site/static/img/clock.svg';
import Note from '@site/static/img/note.svg';
import Download from '@site/static/img/download.svg';
import Gear from '@site/static/img/gear.svg';
import FloppyDisk from '@site/static/img/floppy-disk.svg';
import Discord from '@site/static/img/discord.svg';
import Github from '@site/static/img/github.svg';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <img className={styles.heroBannerBackground} src="/img/sc-v2-theme-dark.png" alt="Screenshot of a calendar in Simple Clandar" />
      <div className={clsx("container", styles.heroBannerContainer)}>
        <img className={styles.herBannerLogo} src="/img/logo.svg" alt="Simple Clanedar Logo" />
        <h1 className={clsx("hero__title", styles.heroBannerTitle)}>{siteConfig.title}</h1>
        <p className={clsx("hero__subtitle", styles.heroBannerTitle)}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="#get-started">
            Get Started
          </Link>
            <Link
                className="button button--secondary button--lg"
                to="#help">
                Need Help?
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
          <section className={styles.sectionAlt}>
              <div className="container">
                  <div className="row">
                      <div className="col">
                          <h2 className="anchor" id="get-started">Get Started<a href="#get-started" className="hash-link" aria-label="Direct link to Get Started" title="Direct link to Get Started">​</a></h2>
                          <p>You can have Simple Calendar up and running in just a few minutes! Just follow the steps below to quickly get a calendar for your game set up and your players using it.</p>

                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <div className={styles.card}>
                              <div className={styles.cardHead}>
                                  <h3>Step 1</h3>
                                  <Download />
                              </div>
                              <div className={styles.cardBody}>
                                  <p><a href="/docs/installing">Install the module</a> following one of the methods, launch the world you want to use Simple Calendar in and <a href="https://foundryvtt.com/article/modules/">activate the module</a>.</p>
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className={styles.card}>
                              <div className={styles.cardHead}>
                                  <h3>Step 2</h3>
                                  <Gear />
                              </div>
                              <div className={styles.cardBody}>
                                  <p><a href="/docs/opening-configuration">Open the Simple Calendar configuration</a> dialog and navigate to the <a href="/docs/calendar-configuration/quick-setup">Quick Setup</a> tab.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <div className={styles.card}>
                              <div className={styles.cardHead}>
                                  <h3>Step 3</h3>
                                  <Calendar />
                              </div>
                              <div className={styles.cardBody}>
                                  <p>Choose from one of the <a href="/docs/calendar-configuration/quick-setup#choose-a-predefined-calendar">many pre configured calendars</a> on this page and click the Next button.</p>
                              </div>
                          </div>
                      </div>
                      <div className="col">
                          <div className={styles.card}>
                              <div className={styles.cardHead}>
                                  <h3>Step 4</h3>
                                  <FloppyDisk />
                              </div>
                              <div className={styles.cardBody}>
                                  <p>Select the in game date the game will start on, or leave it on the default date! Then click Save, the calendar is now ready to go!</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <div className={styles.card}>
                              <div className={styles.cardHead}>
                                  <h3>Step 5</h3>
                                  <MonthIcon />
                              </div>
                              <div className={styles.cardBody}>
                                  <p>Start <a href="/docs/category/using-simple-calendar">using the calendar</a>!</p>
                              </div>
                          </div>
                      </div>
                      <div className="col"></div>
                  </div>
                  <div className="row">
                      <div className="col">
                          <Admonition type="tip">
                              <p>If you want your players to be able to add their own notes be sure to adjust the <a href="/docs/global-configuration/permissions">permissions</a> accordingly!</p>
                          </Admonition>
                          <Admonition type="info">
                              <p>If none of the predefined calendars work for you then you can fully customize the calendar to meet your needs. Be sure to read all of the <a href="/docs/category/calendar-configuration">calendar customization</a> documentation!</p>
                          </Admonition>
                      </div>
                  </div>
              </div>
          </section>
          <section>
              <div className="container">
                  <div className="row">
                      <div className="col">
                          <h2 className="anchor" id="help">Help<a href="#help" className="hash-link" aria-label="Direct link to Help" title="Direct link to Help">​</a></h2>
                          <p>Have questions? Ran into a bug? There are a couple of ways you can get help!</p>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col col--1"></div>
                      <div className="col col--5">
                        <div className={styles.helpItem}>
                            <Discord />
                            <h3>Discord</h3>
                            <p>Check out the the official <a href="https://discord.gg/foundryvtt">FoundryVTT discord</a>. The friendly folks in #module-discussion and #module-troubleshooting can help with lots of questions.</p>
                        </div>
                      </div>
                      <div className="col col--5">
                          <div className={styles.helpItem}>
                              <Github />
                              <h3>Github</h3>
                              <p>You can also put in an issue on the <a href="https://github.com/vigoren/foundryvtt-simple-calendar">GitHub</a> for the project and I will help you out!</p>
                          </div>
                      </div>
                      <div className="col col--1"></div>
                  </div>
              </div>
          </section>
      </main>
    </Layout>
  );
}
