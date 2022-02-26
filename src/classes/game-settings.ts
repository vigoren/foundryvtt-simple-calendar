import Year from "./year";
import { Logger } from "./logging";
import {
	CurrentDateConfig,
	GeneralSettingsConfig,
	LeapYearConfig,
	MonthConfig,
	MoonConfiguration,
	NoteCategory,
	NoteConfig,
	SeasonConfiguration,
	SimpleCalendarSocket,
	TimeConfig,
	WeekdayConfig,
	YearConfig
} from "../interfaces";
import { ModuleName, SettingNames, SimpleCalendarHooks, SocketTypes } from "../constants";
import SimpleCalendar from "./simple-calendar";
import Month from "./month";
import { Weekday } from "./weekday";
import Note from "./note";
import LeapYear from "./leap-year";
import Time from "./time";
import Season from "./season";
import Moon from "./moon";
import Hook from "./hook";
import { SimpleCalendarConfiguration } from "./simple-calendar-configuration";
import GameSockets from "./game-sockets";
import Utilities from "./utilities";

export class GameSettings {
	/**
	 * Returns if the current user is the GM
	 * @return {boolean}
	 */
	static IsGm(): boolean {
		const u = (<Game>game).user;
		return u ? u.isGM : false;
	}

	/**
	 * Returns the current users name
	 * @return {string}
	 */
	static UserName(): string {
		const u = (<Game>game).user;
		return u ? u.name ? u.name : '' : '';
	}

	/**
	 * Returns the current users ID
	 * @return {string}
	 */
	static UserID(): string {
		const u = (<Game>game).user;
		return u ? u.id ? u.id : '' : '';
	}

	static GetUser(userId: string): User | undefined {
		const users = (<Game>game).users;
		if (users) {
			return users.find(u => u.id === userId);
		}
		return undefined;
	}

	/**
	 * Returns the localized string based on the key
	 * @param {string} key The localization string key
	 */
	static Localize(key: string): string {
		if ((<Game>game).i18n) {
			return (<Game>game).i18n.localize(key);
		} else {
			const parts = key.split('.');
			return parts[parts.length - 1];
		}

	}

	/**
	 * Register the settings this module needs to use with the game
	 */
	static RegisterSettings() {
		(<Game>game).settings.registerMenu(ModuleName, SettingNames.CalendarConfigurationMenu, {
			name: "",
			label: "FSC.Configuration.Title",
			hint: "",
			icon: "fa fa-cog",
			// @ts-ignore TODO XDY Fix this type
			type: SimpleCalendarConfiguration,
			restricted: true
		});
		(<Game>game).settings.register(ModuleName, SettingNames.GeneralConfiguration, {
			name: "General Configuration",
			scope: "world",
			config: false,
			type: Object,
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'general')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.YearConfiguration, {
			name: "Year Configuration",
			scope: "world",
			config: false,
			type: Object,
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'year')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.WeekdayConfiguration, {
			name: "Weekday Configuration",
			scope: "world",
			config: false,
			type: Array,
			default: [],
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'weekday')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.MonthConfiguration, {
			name: "Month Configuration",
			scope: "world",
			config: false,
			type: Array,
			default: [],
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'month')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.CurrentDate, {
			name: "Current Date",
			scope: "world",
			config: false,
			type: Object,
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'current')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.LeapYearRule, {
			name: "Leap Year Rule",
			scope: "world",
			config: false,
			type: Object,
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'leapyear')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.DefaultNoteVisibility, {
			name: "FSC.Configuration.DefaultNoteVisibility",
			hint: "FSC.Configuration.DefaultNoteVisibilityHint",
			scope: "world",
			type: Boolean,
			default: false
		});
		(<Game>game).settings.register(ModuleName, SettingNames.Notes, {
			name: "Notes",
			scope: "world",
			config: false,
			type: Array,
			default: [],
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'notes')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.TimeConfiguration, {
			name: "Time",
			scope: "world",
			config: false,
			type: Object,
			default: {},
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'time')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.SeasonConfiguration, {
			name: "Season Configuration",
			scope: "world",
			config: false,
			type: Array,
			default: [],
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'season')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.MoonConfiguration, {
			name: "Moon Configuration",
			scope: "world",
			config: false,
			type: Array,
			default: [],
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'moon')
		});
		(<Game>game).settings.register(ModuleName, SettingNames.NoteCategories, {
			name: "Note Categories",
			scope: "world",
			config: false,
			type: Array,
			default: [{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}],
			onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true, 'note-categories')
		});

		(<Game>game).settings.register("about-time", "savedCalendar", {
			name: "Hidden",
			hint: "Don't touch this",
			default: {},
			type: Object,
			scope: 'world',
			config: false
		});

	}

	/**
	 * Gets the default note visibility setting
	 * @return {boolean}
	 */
	static GetDefaultNoteVisibility() {
		return <boolean>(<Game>game).settings.get(ModuleName, SettingNames.DefaultNoteVisibility);
	}

	/**
	 * Loads the general settings from the game world settings
	 */
	static LoadGeneralSettings(): GeneralSettingsConfig {
		return <GeneralSettingsConfig>(<Game>game).settings.get(ModuleName, SettingNames.GeneralConfiguration);
	}

	/**
	 * Loads the year configuration from the game world settings
	 * @return {YearConfig}
	 */
	static LoadYearData(): YearConfig {
		return <YearConfig>(<Game>game).settings.get(ModuleName, SettingNames.YearConfiguration);
	}

	/**
	 * Loads the current date from the game world settings
	 * @return {Array.<CurrentDateConfig>}
	 */
	static LoadCurrentDate(): CurrentDateConfig {
		return <CurrentDateConfig>(<Game>game).settings.get(ModuleName, SettingNames.CurrentDate);
	}

	/**
	 * Loads the month configuration from the game world settings
	 * @return {Array.<MonthConfig>}
	 */
	static LoadMonthData(): MonthConfig[] {
		let returnData: MonthConfig[] = [];
		let monthData = <any[]>(<Game>game).settings.get(ModuleName, SettingNames.MonthConfiguration);
		if (monthData && monthData.length) {
			if (Array.isArray(monthData[0])) {
				returnData = <MonthConfig[]>monthData[0];
			} else {
				returnData = <MonthConfig[]>monthData;
			}
		}
		return returnData;
	}

	/**
	 * Loads the weekday configuration from the game world settings
	 * @return {Array.<WeekdayConfig>}
	 */
	static LoadWeekdayData(): WeekdayConfig[] {
		let returnData: WeekdayConfig[] = [];
		let weekdayData = <any[]>(<Game>game).settings.get(ModuleName, SettingNames.WeekdayConfiguration);
		if (weekdayData && weekdayData.length) {
			if (Array.isArray(weekdayData[0])) {
				returnData = <WeekdayConfig[]>weekdayData[0];
			} else {
				returnData = <WeekdayConfig[]>weekdayData;
			}
		}
		return returnData;
	}

	/**
	 * Loads the season configuration from the game world settings
	 * @return {Array.<SeasonConfiguration>}
	 */
	static LoadSeasonData(): SeasonConfiguration[] {
		let returnData: SeasonConfiguration[] = [];
		let seasonData = <any[]>(<Game>game).settings.get(ModuleName, SettingNames.SeasonConfiguration);
		if (seasonData && seasonData.length) {
			if (Array.isArray(seasonData[0])) {
				returnData = <SeasonConfiguration[]>seasonData[0];
			} else {
				returnData = <SeasonConfiguration[]>seasonData;
			}
		}
		return returnData;
	}

	/**
	 * Loads the moon configuration from the game world settings
	 * @return {Array.<SeasonConfiguration>}
	 */
	static LoadMoonData(): MoonConfiguration[] {
		let returnData: MoonConfiguration[] = [];
		let moonData = <any[]>(<Game>game).settings.get(ModuleName, SettingNames.MoonConfiguration);
		if (moonData && moonData.length) {
			if (Array.isArray(moonData[0])) {
				returnData = <MoonConfiguration[]>moonData[0];
			} else {
				returnData = <MoonConfiguration[]>moonData;
			}
		}
		return returnData;
	}

	/**
	 * Loads the leap year rules from the settings
	 * @return {LeapYearConfig}
	 */
	static LoadLeapYearRules(): LeapYearConfig {
		return <LeapYearConfig>(<Game>game).settings.get(ModuleName, SettingNames.LeapYearRule);
	}

	/**
	 * Loads the time configuration from the game world settings
	 */
	static LoadTimeData(): TimeConfig {
		return <TimeConfig>(<Game>game).settings.get(ModuleName, SettingNames.TimeConfiguration);
	}

	/**
	 * Loads the notes from the game world settings
	 * @return {Array.<NoteConfig>}
	 */
	static LoadNotes(): NoteConfig[] {
		let returnData: NoteConfig[] = [];
		let notes = <any[]>(<Game>game).settings.get(ModuleName, SettingNames.Notes);
		if (notes && notes.length) {
			if (Array.isArray(notes[0])) {
				returnData = <NoteConfig[]>notes[0];
			} else {
				returnData = <NoteConfig[]>notes;
			}
		}
		return returnData;
	}

	/**
	 * Loads the note categories from the game world settings
	 * @return {Array.<NoteCategory>}
	 */
	static LoadNoteCategories(): NoteCategory[] {
		let returnData: NoteCategory[] = [];
		let noteCategories = <any[]>(<Game>game).settings.get(ModuleName, SettingNames.NoteCategories);
		if (noteCategories && noteCategories.length) {
			if (Array.isArray(noteCategories[0])) {
				returnData = <NoteCategory[]>noteCategories[0];
			} else {
				returnData = <NoteCategory[]>noteCategories;
			}
		}
		return returnData;
	}

	/**
	 * Saves the general settings to the world settings
	 * @param {GeneralSettingsConfig} settings The settings to save
	 */
	static async SaveGeneralSettings(settings: GeneralSettingsConfig): Promise<boolean> {
		if (GameSettings.IsGm()) {
			Logger.debug('Saving General Settings.');
			const currentSettings = GameSettings.LoadGeneralSettings();
			if (JSON.stringify(settings) !== JSON.stringify(currentSettings)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.GeneralConfiguration, settings).then(() => {
					return true;
				});
			} else {
				Logger.debug('General Settings have not changed, not updating.');
			}
		}
		return false
	}

	/**
	 * Saves the current date to the world settings
	 * @param {Year} year The year that has the current date
	 * @param {boolean} emitHook If to emit the hook or not
	 */
	static async SaveCurrentDate(year: Year, emitHook: boolean = true): Promise<boolean> {
		if (GameSettings.IsGm()) {
			Logger.debug(`Saving current date.`);
			const currentMonth = year.getMonth();
			if (currentMonth) {
				const currentDay = currentMonth.getDay();
				if (currentDay) {
					const currentDate = <CurrentDateConfig>(<Game>game).settings.get(ModuleName, SettingNames.CurrentDate);
					const newDate: CurrentDateConfig = {
						year: year.numericRepresentation,
						month: currentMonth.numericRepresentation,
						day: currentDay.numericRepresentation,
						seconds: year.time.seconds
					};
					if (currentDate.year !== newDate.year || currentDate.month !== newDate.month || currentDate.day !== newDate.day || currentDate.seconds !== newDate.seconds) {
						await (<Game>game).settings.set(ModuleName, SettingNames.CurrentDate, newDate);
						if (emitHook && SimpleCalendar.instance) {
							const diff = year.toSeconds() - (Utilities.ToSeconds(currentDate.year, currentDate.month, currentDate.day, false) + currentDate.seconds);
							await GameSockets.emit(<SimpleCalendarSocket.Data>{
								type: SocketTypes.emitHook,
								data: <SimpleCalendarSocket.SimpleCalendarEmitHook>{
									hook: SimpleCalendarHooks.DateTimeChange,
									param: diff
								}
							});
							Hook.emit(SimpleCalendarHooks.DateTimeChange, diff);
						}
						await GameSockets.emit(<SimpleCalendarSocket.Data>{
							type: SocketTypes.noteReminders,
							data: {justTimeChange: currentDate.seconds !== newDate.seconds && currentDate.day === newDate.day}
						});
						if (SimpleCalendar.instance) {
							SimpleCalendar.instance.checkNoteReminders(currentDate.seconds !== newDate.seconds && currentDate.day === newDate.day);
						}
						return true;
					} else {
						Logger.debug('Current Date data has not changed, not updating settings');
					}
				} else {
					Logger.error('Unable to save current date, no current day found.');
				}
			} else {
				Logger.error('Unable to save current date, no current month found.');
			}
		} else {
			Logger.error('Unable to save current date, no current year found.');
		}
		return false;
	}

	/**
	 * Saves the passed in year configuration into the world settings
	 * @param {Year} year The year that makes up the configuration
	 */
	static async SaveYearConfiguration(year: Year): Promise<boolean> {
		if (GameSettings.IsGm()) {
			Logger.debug(`Saving year configuration.`);
			const currentYearConfig = <YearConfig>(<Game>game).settings.get(ModuleName, SettingNames.YearConfiguration);
			if (!currentYearConfig.hasOwnProperty('showWeekdayHeadings')) {
				currentYearConfig.showWeekdayHeadings = true;
			}
			const yc: YearConfig = year.toConfig();
			if (JSON.stringify(currentYearConfig) !== JSON.stringify(yc)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.YearConfiguration, yc).then(() => {
					return true
				}); //Return true because if no error was thrown then the save was successful and we don't need the returned data.
			} else {
				Logger.debug('Year configuration has not changed, not updating settings');
			}
		}
		return false;
	}

	/**
	 * Saves the passed in month configuration into the world settings
	 * @param {Array.<Month>} months
	 */
	static async SaveMonthConfiguration(months: Month[]): Promise<any> {
		if (GameSettings.IsGm()) {
			Logger.debug(`Saving month configuration.`);
			const currentMonthConfig = JSON.stringify(GameSettings.LoadMonthData());
			const newConfig: MonthConfig[] = months.map(m => m.toConfig());
			if (currentMonthConfig !== JSON.stringify(newConfig)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.MonthConfiguration, newConfig).then(() => {
					return true;
				});
			} else {
				Logger.debug('Month configuration has not changed, not updating settings');
			}
		}
		return false;
	}

	/**
	 * Saves the passed in weekday configuration into the world settings
	 * @param {Array.<Weekday>} weekdays The weekdays that make up the configuration
	 */
	static async SaveWeekdayConfiguration(weekdays: Weekday[]): Promise<any> {
		if (GameSettings.IsGm()) {
			Logger.debug(`Saving weekday configuration.`);
			const currentWeekdayConfig = JSON.stringify(GameSettings.LoadWeekdayData());
			const newConfig: WeekdayConfig[] = weekdays.map(w => w.toConfig());
			if (currentWeekdayConfig !== JSON.stringify(newConfig)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.WeekdayConfiguration, newConfig).then(() => {
					return true;
				});
			} else {
				Logger.debug('Weekday configuration has not changed, not updating settings');
			}

		}
		return false;
	}

	/**
	 * Saves the passed in season configuration in the world settings
	 * @param {Array.<Season>>} seasons List of seasons
	 */
	static async SaveSeasonConfiguration(seasons: Season[]): Promise<boolean> {
		if (GameSettings.IsGm()) {
			Logger.debug('Saving season configuration.');
			const currentConfig = JSON.stringify(GameSettings.LoadSeasonData());
			const newConfig: SeasonConfiguration[] = seasons.map(s => s.toConfig());
			if (currentConfig !== JSON.stringify(newConfig)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.SeasonConfiguration, newConfig).then(() => {
					return true;
				});
			} else {
				Logger.debug('Season configuration has not changed, not updating.');
			}
		}
		return false;
	}

	/**
	 * Saves the passed in moon configuration in the world settings
	 * @param {Array.<Moon>} moons List of moons
	 */
	static async SaveMoonConfiguration(moons: Moon[]): Promise<boolean> {
		if (GameSettings.IsGm()) {
			Logger.debug('Saving moon configuration.');
			const currentConfig = JSON.stringify(GameSettings.LoadMoonData());
			const newConfig: MoonConfiguration[] = moons.map(m => m.toConfig());
			if (currentConfig !== JSON.stringify(newConfig)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.MoonConfiguration, newConfig).then(() => {
					return true;
				});
			} else {
				Logger.debug('Moon configuration has not changed, not updating.');
			}
		}
		return false;
	}

	/**
	 * Saves the passed in leap year configuration into the world settings
	 * @param {LeapYear} leapYear The leap year settings to save
	 */
	static async SaveLeapYearRules(leapYear: LeapYear): Promise<any> {
		if (GameSettings.IsGm()) {
			Logger.debug(`Saving leap year configuration.`);
			const current = GameSettings.LoadLeapYearRules();
			const newlyc: LeapYearConfig = leapYear.toConfig();
			if (current.rule !== newlyc.rule || current.customMod !== newlyc.customMod) {
				return (<Game>game).settings.set(ModuleName, SettingNames.LeapYearRule, newlyc);
			} else {
				Logger.debug('Leap Year configuration has not changed, not updating settings');
			}

		}
		return false;
	}

	/**
	 * Saves the time configuration into the world settings
	 * @param {Time} time The time object to save
	 */
	static async SaveTimeConfiguration(time: Time): Promise<boolean> {
		if (GameSettings.IsGm()) {
			Logger.debug(`Saving time configuration.`);
			const current = GameSettings.LoadTimeData();
			const newtc: TimeConfig = time.toConfig();
			if (JSON.stringify(current) !== JSON.stringify(newtc)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.TimeConfiguration, newtc).then(() => {
					return true
				});
			} else {
				Logger.debug('Time configuration has not changed, not updating settings');
			}
		}
		return false;
	}

	static async SaveNoteCategories(categories: NoteCategory[]): Promise<any> {
		Logger.debug(`Saving Note Categories.`);
		if (GameSettings.IsGm()) {
			const current = GameSettings.LoadNoteCategories();
			if (JSON.stringify(current) !== JSON.stringify(categories)) {
				return (<Game>game).settings.set(ModuleName, SettingNames.NoteCategories, categories).then(() => {
					return true
				});
			} else {
				Logger.debug('Note Categories have not changed, not updating');
			}
		}
		return false;
	}

	/**
	 * Saves the passed in notes into the world settings
	 * @param {Array.<Note>} notes The notes to save
	 */
	static async SaveNotes(notes: Note[]): Promise<any> {
		Logger.debug(`Saving notes.`);
		const newConfig: NoteConfig[] = notes.map(w => {
			return {
				title: w.title,
				content: w.content,
				author: w.author,
				year: w.year,
				month: w.month,
				day: w.day,
				monthDisplay: w.monthDisplay,
				playerVisible: w.playerVisible,
				id: w.id,
				repeats: w.repeats,
				allDay: w.allDay,
				hour: w.hour,
				minute: w.minute,
				endDate: w.endDate,
				order: w.order,
				categories: w.categories,
				remindUsers: w.remindUsers
			};
		});
		if (GameSettings.IsGm()) {
			return (<Game>game).settings.set(ModuleName, SettingNames.Notes, newConfig).then(() => {
				return true;
			});
		} else {
			const socketData = <SimpleCalendarSocket.Data>{type: SocketTypes.journal, data: {notes: notes}};
			Logger.debug(`User saving notes...`);
			await GameSockets.emit(socketData);
			return;
		}

	}

	/**
	 * Sets the default note visibility settings
	 * @param {boolean} visibility What to set the default visibility too
	 */
	static async SetDefaultNoteVisibility(visibility: boolean): Promise<boolean> {
		if (GameSettings.IsGm()) {
			return await (<Game>game).settings.set(ModuleName, SettingNames.DefaultNoteVisibility, visibility).then(() => {
				return true;
			});
		}
		return false;
	}

	/**
	 * Display a notification using the game UI
	 * @param {string} message The message to display
	 * @param {string} type The type of notification to show
	 */
	static UiNotification(message: string, type: string = 'info') {
		if (ui.notifications) {
			if (type === 'info') {
				ui.notifications.info(message);
			} else if (type === 'warn') {
				ui.notifications.warn(message);
			} else if (type === 'error') {
				ui.notifications.error(message);
			}
		} else {
			Logger.error('The UI class is not initialized.');
		}
	}
}
