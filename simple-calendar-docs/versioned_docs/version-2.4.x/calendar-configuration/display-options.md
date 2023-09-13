# Display Options

This section is used to configure how different aspects of Simple Calendar are displayed for this calendar.

## Date/Time Formatting

![](../images/calendar-display-options.png)

A date time format is text containing special tokens. These tokens are replaced with the corresponding date/time information to create a finalized display of that date and time. Below is a list of the different tokens available to use in Simple Calendar and what they do.

| Setting                       | Description                                                                                                                          | Default            |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| Date Format                   | This format text is used when displaying a date anywhere in Simple Calendar.                                                         | MMMM DD, YYYY      |
| Time Format                   | This format text is used when displaying a time anywhere in Simple Calendar.                                                         | HH:mm:ss           |
| Month/Year Format             | This format text is used when displaying just the month and year that appears at the top of a calendar view, above the list of days. | MMMM YAYYYYYZ      |
| Chat Message Timestamp Format | This format text is used when displaying text for a chat messages timestamp.                                                         | MMM DD, YYYY HH:mm |

Below are the tokens used in the above settings fields to configure the date and time to display how you want it to.

<table class="table table-striped table-bordered">
  <tbody>
    <tr>
      <th></th>
      <th>Token</th>
      <th>Description</th>
      <th>Example Results</th>
    </tr>
    <tr>
      <td><strong>Year</strong></td>
      <td>YY</td>
      <td>Year shorthand</td>
      <td>90 91 ... 19 20</td>
    </tr>
    <tr>
      <td></td>
      <td>YYYY</td>
      <td>Full year</td>
      <td>1990 1991 ... 2019 2020</td>
    </tr>
    <tr>
      <td></td>
      <td>YN</td>
      <td>Year name, as determined by the <a href="year-settings#year-names">year name settings</a>.</td>
      <td>Ral's Fury</td>
    </tr>
    <tr>
      <td></td>
      <td>YA</td>
      <td>Year prefix as defined in the <a href="year-settings#year-prefix">Year Prefix setting</a>.</td>
      <td>Pre</td>
    </tr>
    <tr>
      <td></td>
      <td>YZ</td>
      <td>Year postfix as defined in the <a href="year-settings#year-postfix">Year Postfix setting</a>.</td>
      <td>AD</td>
    </tr>
    <tr>
      <td><strong>Month</strong></td>
      <td>M</td>
      <td>Months number.</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>MM</td>
      <td>Months number padded with a zero.</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>MMM</td>
      <td>The months abbreviated name as defined in the <a href="month-settings#month-name-abbreviation">months settings</a>.</td>
      <td>Jan Feb ... Nov Dec</td>
    </tr>
    <tr>
      <td></td>
      <td>MMMM</td>
      <td>The months full name as defined in the <a href="month-settings#month-name">months settings</a>.</td>
      <td>January February ... November December</td>
    </tr>
    <tr>
      <td><strong>Day</strong></td>
      <td>D</td>
      <td>Day number.</td>
      <td>1 2 ... 30 31</td>
    </tr>
    <tr>
      <td></td>
      <td>DD</td>
      <td>Day number padded with a zero.</td>
      <td>01 02 ... 30 31</td>
    </tr>
    <tr>
      <td></td>
      <td>DO</td>
      <td>Day number appended with its suffix.</td>
      <td>1st 2nd ... 30th 31st</td>
    </tr>
    <tr>
      <td><strong>Weekday</strong></td>
      <td>d</td>
      <td>The number for the day of the week.</td>
      <td>1 2 ... 6 7</td>
    </tr>
    <tr>
      <td></td>
      <td>dd</td>
      <td>The number for the day of the week padded with a zero.</td>
      <td>01 02 ... 06 07</td>
    </tr>
    <tr>
      <td></td>
      <td>ddd</td>
      <td>The abbreviated name for the day of the week as defined in the <a href="weekday-settings#weekday-name-abbreviation">weekday settings</a>.</td>
      <td>Sun Mon ... Fri Sat</td>
    </tr>
    <tr>
      <td></td>
      <td>dddd</td>
      <td>The full name for the day of the week as defined in the <a href="weekday-settings#weekday-name">weekday settings</a>.</td>
      <td>Sunday Monday ... Friday Saturday</td>
    </tr>
    <tr>
      <td><strong>Hour</strong></td>
      <td>h</td>
      <td>The hours number in the 12 hour format.</td>
      <td>1 2 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>H</td>
      <td>The hours number in the 24 hour format</td>
      <td>0 1 ... 22 23</td>
    </tr>
    <tr>
      <td></td>
      <td>hh</td>
      <td>The hours number padded with a zero in the 12 hour format.</td>
      <td>01 02 ... 11 12</td>
    </tr>
    <tr>
      <td></td>
      <td>HH</td>
      <td>The hours number padded with a zero in the 24 hour format.</td>
      <td>00 01 ... 22 23</td>
    </tr>
    <tr>
      <td></td>
      <td>a</td>
      <td>The am/pm indicator for the 12 hour time format in lowercase.</td>
      <td>am pm</td>
    </tr>
    <tr>
      <td></td>
      <td>A</td>
      <td>The AM/PM indicator for the 12 hour time format in uppercase.</td>
      <td>AM PM</td>
    </tr>
     <tr>
      <td><strong>Minute</strong></td>
      <td>m</td>
      <td>The minutes number.</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td></td>
      <td>mm</td>
      <td>The minutes number padded with a zero.</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><strong>Second</strong></td>
      <td>s</td>
      <td>The seconds number.</td>
      <td>0 1 ... 58 59</td>
    </tr>
    <tr>
      <td></td>
      <td>ss</td>
      <td>The seconds number padded with a zero.</td>
      <td>00 01 ... 58 59</td>
    </tr>
    <tr>
      <td><strong>Text</strong></td>
      <td>[*]</td>
      <td> For any text that should be in the format but not processed place square brackets around it.</td>
      <td>[Don't process this text]</td>
    </tr>
  </tbody>
</table>

## Compact View Options

![](../images/calendar-display-options-compact-view.png)

The [compact view](../using-sc/compact-view) has options to customize how it looks.

### Compact View Date/Time Control Layout

Choose the layout for the buttons used to change the date/time of the calendar while in compact view.

The options are:

#### Full Controls

This is the default setting and will show both the [Date / Time Adjuster](../using-sc/changing-date-time#date--time-adjuster) and [Dawn, Midday, Dusk and Midnight](../using-sc/changing-date-time#dawn-midday-dusk-midnight) buttons.

#### Quick Increment
This setting shows a refined list of predefined values the date and time can be changed by. It also shows the [Dawn, Midday, Dusk and Midnight](../using-sc/changing-date-time#dawn-midday-dusk-midnight) buttons.

The list of predefined values are:

- 1 Round (1r)
- 1 Minute (1m)
- 5 Minutes (5m)
- 15 Minutes (15m)
- 1 Hour (1h)

This setting also supports key modifiers to adjust those predefined values

- **Shift Key**: When the shift key is held down the amount of time that is changed for each increment is increased from 1 round, 1 minute, 5 minutes, 15 minutes, 1 hour to 5 rounds, 5 minutes, 20 minutes, 45 minutes, 5 hours.
- **Control Key**: When the control key is held down each increment will be subtracted from the current time, this can be combined with the shift key for going back in time by larger amounts.
