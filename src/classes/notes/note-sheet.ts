import { ModuleName, NoteRepeat, SocketTypes, Themes } from "../../constants";
import { DateTheSame, DaysBetweenDates, FormatDateTime } from "../utilities/date-time";
import { GameSettings } from "../foundry-interfacing/game-settings";
import DateSelectorManager from "../date-selector/date-selector-manager";
import { CalManager, MainApplication, NManager, SC } from "../index";
import { animateElement, ConvertPxBasedOnRemSize, GetThemeName } from "../utilities/visual";
import { getCheckBoxInputValue, getNumericInputValue, getTextInputValue } from "../utilities/inputs";
import GameSockets from "../foundry-interfacing/game-sockets";
import { ConcreteJournalEntry } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/apps/forms/journal-sheet";
import MultiSelect from "../renderer/multi-select";
import { foundryMergeObject } from "../foundry-interfacing/utilities";

export class NoteSheet extends JournalSheet {
    private dirty: boolean = false;

    private resized: boolean = false;

    private editMode: boolean = false;

    private readonly dateSelectorId: string;

    private readonly categoryMultiSelectId: string;

    private readonly playerMultiSelectId: string;

    private static appWindowId: string = "fsc-simple-calendar-note-journal-form";

    private journalData = {
        _id: "",
        name: "",
        flags: <Record<string, any>>{},
        ownership: <Partial<Record<string, 0 | 1 | 2 | 3>>>{}
    };

    private journalPages: SimpleCalendar.JournalPageData[] = [];
    /**
     * The HTML element representing the application window
     */
    public appWindow: HTMLElement | null = null;

    uiElementStates = {
        "fsc-page-list": false,
        selectedPageIndex: 0,
        search: {
            term: ""
        }
    };

    private inputChangeRedrawNames = ["src", "image.caption", "video.width", "video.height"];

    public static SetHeight(ns: NoteSheet) {
        if (ns.appWindow && ns.appWindow instanceof Element) {
            const pseudoAfter = window.getComputedStyle(ns.appWindow, ":after");
            if (!ns.resized) {
                const form = ns.appWindow.getElementsByTagName("form");
                if (form && form.length) {
                    let height = 0;
                    const header = ns.appWindow.getElementsByTagName("header");
                    if (header && header.length) {
                        height += header[0].offsetHeight;
                    }
                    const section = ns.appWindow.querySelector(".window-content");
                    if (section) {
                        const cs = window.getComputedStyle(section);
                        height += (parseInt(cs.borderTop) || 0) + (parseInt(cs.borderBottom) || 0);
                    }
                    if (ns.editMode) {
                        height += form[0].scrollHeight;
                    } else {
                        const formCompStyl = window.getComputedStyle(form[0]);
                        if (formCompStyl) {
                            height += (parseInt(formCompStyl.paddingTop) || 0) + (parseInt(formCompStyl.paddingBottom) || 0);
                        }
                        const nHeader = <HTMLElement>ns.appWindow.querySelector(".fsc-note-header");
                        const nContent = <HTMLElement>ns.appWindow.querySelector(".fsc-content");
                        const nEditControls = <HTMLElement>ns.appWindow.querySelector(".fsc-edit-controls");
                        if (nHeader) {
                            const cs = window.getComputedStyle(nHeader);
                            height += nHeader.offsetHeight + parseInt(cs.marginTop) + parseInt(cs.marginBottom);
                        }
                        if (nContent) {
                            const cs = window.getComputedStyle(nContent);
                            height +=
                                nContent.scrollHeight +
                                parseInt(cs.marginTop) +
                                parseInt(cs.marginBottom) +
                                (parseInt(cs.borderTop) || 0) +
                                (parseInt(cs.borderBottom) || 0);
                        }
                        if (nEditControls) {
                            const cs = window.getComputedStyle(nEditControls);
                            height += nEditControls.offsetHeight + parseInt(cs.marginTop) + parseInt(cs.marginBottom);
                        }
                    }

                    //Check for an after element
                    if (pseudoAfter) {
                        height += parseInt(pseudoAfter.height) || 0;
                    }

                    if (ns.editMode && height < 740) {
                        height = 740;
                    }
                    const maxHeight = window.outerHeight * 0.95;
                    if (height > maxHeight) {
                        height = maxHeight;
                    }
                    ns.setPosition({ height: ConvertPxBasedOnRemSize(height), width: ConvertPxBasedOnRemSize(720) });
                }
            }
            const cList = ns.appWindow.querySelector(`.fsc-page-list`);
            const wrapper = ns.appWindow.querySelector(".fsc-page-details, .fsc-note-header");
            if (cList && wrapper) {
                (<HTMLElement>cList).style.top = (<HTMLElement>wrapper).offsetTop + "px";
                (<HTMLElement>cList).style.height = `calc(100% - ${(<HTMLElement>wrapper).offsetTop}px - ${pseudoAfter.height})`;
            }
        }
    }

    constructor(object: ConcreteJournalEntry, options = {}) {
        super(object, options);
        this.dateSelectorId = `scNoteDate_${this.object.id}`;
        this.categoryMultiSelectId = `scNoteCategories_${this.object.id}`;
        this.playerMultiSelectId = `scUserPermissions_${this.object.id}`;
        this.copyData();
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/note-sheet.html";
        options.title = "Simple Calendar Note";
        options.id = this.appWindowId;
        options.classes = ["sheet", "journal-sheet", "simple-calendar"];
        options.resizable = true;
        options.closeOnSubmit = false;
        if ((<Game>game).settings) {
            options.classes.push(GetThemeName());
        }
        return options;
    }

    static get defaultObject() {
        return {};
    }

    get template() {
        return this.options.template || "";
    }

    get type() {
        return "simplecalendarnote";
    }

    copyData() {
        this.journalData._id = this.object.id || "";
        this.journalData.name = this.object.name || "";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.journalData.flags = foundryMergeObject({}, this.object.flags);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.journalData.ownership = foundryMergeObject({}, this.object.ownership);
        this.journalPages = [];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        for (let i = 0; i < this.object.pages.contents.length; i++) {
            this.journalPages.push({
                show: true,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                _id: this.object.pages.contents[i]._id,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                name: this.object.pages.contents[i].name,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                type: this.object.pages.contents[i].type,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                text: { content: this.object.pages.contents[i].text.content },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                src: this.object.pages.contents[i].src,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                image: { caption: this.object.pages.contents[i].image.caption },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                video: this.object.pages.contents[i].video
            });
        }
    }

    override get title(): string {
        return this.object.name || "Note";
    }

    close(): Promise<void> {
        if (this.dirty) {
            const dialog = new Dialog({
                title: GameSettings.Localize("FSC.NoteDirty"),
                content: GameSettings.Localize("FSC.NoteDirtyText"),
                buttons: {
                    yes: {
                        icon: '<i class="fas fa-trash"></i>',
                        label: GameSettings.Localize("FSC.DiscardChanges"),
                        callback: this.isDirtyDialogClose.bind(this, false)
                    },
                    save: {
                        icon: '<i class="fas fa-save"></i>',
                        label: GameSettings.Localize("FSC.Save"),
                        callback: this.isDirtyDialogClose.bind(this, true)
                    }
                },
                default: "save"
            });
            dialog.render(true);
            return Promise.resolve();
        } else {
            this.dirty = false;
            this.editMode = false;
            this.resized = false;
            this.uiElementStates["fsc-page-list"] = false;
            this.uiElementStates.selectedPageIndex = 0;
            this.cleanUpProsemirror();
            DateSelectorManager.DeactivateSelector(this.dateSelectorId);
            return super.close({ submit: false });
        }
    }

    cleanUpProsemirror() {
        Object.values(this.editors).forEach((ed) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            if (ed.instance) ed.instance.destroy();
        });
    }

    async isDirtyDialogClose(save: boolean) {
        this.dirty = false;
        if (save) {
            await this.save(new Event("click"));
        } else {
            this.copyData();
        }
        return this.close();
    }

    render(force?: boolean, options?: Application.RenderOptions<DocumentSheetOptions>, startInEditMode?: boolean): this {
        if (startInEditMode !== undefined) {
            this.editMode = startInEditMode;
        }
        return super.render(force, options);
    }

    async getData(): Promise<JournalSheet.Data> {
        const newOptions = {
            ...super.getData(),
            pages: this.journalPages,
            editMode: this.editMode,
            uiElementStates: this.uiElementStates,
            name: "",
            enrichedContent: "",
            display: {
                date: "",
                reminder: false,
                repeats: 0,
                repeatsDisplay: "",
                author: { colorText: "", color: "", name: "" },
                categories: <any>[],
                macro: ""
            },
            edit: {
                dateDisplay: "",
                repeats: NoteRepeat.Never,
                noteData: {},
                users: <SimpleCalendar.Renderer.MultiSelectOption[]>[],
                timeSelected: false,
                dateSelectorId: this.dateSelectorId,
                dateSelectorSelect: this.dateSelectorSelect.bind(this),
                repeatOptions: <SimpleCalendar.NoteRepeats>{
                    0: "FSC.Notes.Repeat.Never",
                    1: "FSC.Notes.Repeat.Weekly",
                    2: "FSC.Notes.Repeat.Monthly",
                    3: "FSC.Notes.Repeat.Yearly"
                },
                allCategories: <any>[],
                macroList: <Record<string, string>>{ none: "No Macro" },
                selectedMacro: "",
                categoryMultiSelectId: this.categoryMultiSelectId,
                playerMultiSelectId: this.playerMultiSelectId,
                reminder: false,
                pageTypes: {
                    text: "JOURNALENTRYPAGE.TypeText",
                    image: "JOURNALENTRYPAGE.TypeImage",
                    pdf: "JOURNALENTRYPAGE.TypePDF",
                    video: "JOURNALENTRYPAGE.TypeVideo"
                },
                page: {
                    name: "",
                    type: "",
                    src: "",
                    image: { caption: "" },
                    video: {
                        width: <number | null | undefined>undefined,
                        height: <number | null | undefined>undefined,
                        controls: false,
                        autoplay: false,
                        loop: false,
                        volume: 0.5,
                        volumeDisplay: "50%",
                        timestamp: 0,
                        timestampParts: {}
                    }
                }
            }
        };

        const noteStub = NManager.getNoteStub(<JournalEntry>this.object);
        if (noteStub) {
            newOptions.name = this.journalData.name;
            if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "text") {
                newOptions.enrichedContent = `<section>${await TextEditor.enrichHTML(
                    this.journalPages[this.uiElementStates.selectedPageIndex].text?.content || "",
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    { async: true }
                )}</section>`;
            } else if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "image") {
                newOptions.enrichedContent = this.generateImageHTML();
            } else if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "pdf") {
                newOptions.enrichedContent = await this.generatePDFHTML(undefined, this.editMode);
            } else if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "video") {
                newOptions.enrichedContent = this.generateVideoHTML();
            }

            if (this.editMode) {
                newOptions.edit.page.name = this.journalPages[this.uiElementStates.selectedPageIndex].name;
                newOptions.edit.page.type = this.journalPages[this.uiElementStates.selectedPageIndex].type;
                newOptions.edit.page.src = this.journalPages[this.uiElementStates.selectedPageIndex].src || "";
                newOptions.edit.page.image.caption = this.journalPages[this.uiElementStates.selectedPageIndex].image?.caption || "";
                newOptions.edit.page.video.width = this.journalPages[this.uiElementStates.selectedPageIndex].video?.width;
                newOptions.edit.page.video.height = this.journalPages[this.uiElementStates.selectedPageIndex].video?.height;
                newOptions.edit.page.video.controls = this.journalPages[this.uiElementStates.selectedPageIndex].video?.controls || false;
                newOptions.edit.page.video.autoplay = this.journalPages[this.uiElementStates.selectedPageIndex].video?.autoplay || false;
                newOptions.edit.page.video.loop = this.journalPages[this.uiElementStates.selectedPageIndex].video?.loop || false;
                newOptions.edit.page.video.volume = this.journalPages[this.uiElementStates.selectedPageIndex].video?.volume || 0.5;
                newOptions.edit.page.video.volumeDisplay = `${Math.round(newOptions.edit.page.video.volume * 100)}%`;
                newOptions.edit.page.video.timestamp = this.journalPages[this.uiElementStates.selectedPageIndex].video?.timestamp || 0;
                let h = 0,
                    m = 0,
                    s = 0;
                if (newOptions.edit.page.video.timestamp) {
                    h = Math.floor(newOptions.edit.page.video.timestamp / 3600);
                    m = Math.floor((newOptions.edit.page.video.timestamp % 3600) / 60);
                    s = newOptions.edit.page.video.timestamp - h * 3600 - m * 60;
                }
                newOptions.edit.page.video.timestampParts = { h: h, m: m, s: s };

                newOptions.edit.noteData = noteStub.noteData || {};
                newOptions.edit.timeSelected = !noteStub.allDay;
                newOptions.edit.repeats = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).repeats || noteStub.repeats;
                const users = (<Game>game).users;
                if (users) {
                    newOptions.edit.users = users.map((u) => {
                        return {
                            text: u.name || "",
                            value: u.id,
                            selected: this.journalData.ownership[u.id] !== 0,
                            static: u.id === (<Game>game).user?.id,
                            disabled:
                                u.id === (<Game>game).user?.id ||
                                (this.journalData.ownership["default"] !== undefined && this.journalData.ownership["default"] >= 2)
                        };
                    });
                    newOptions.edit.users.unshift({
                        text: GameSettings.Localize("FSC.Notes.Permissions.AllPlayers"),
                        value: "default",
                        makeOthersMatch: true,
                        selected: this.journalData.ownership["default"] !== undefined && this.journalData.ownership["default"] !== 0,
                        disabled: false
                    });
                }
                const noteData = noteStub.noteData;
                if (noteData) {
                    const calendar = CalManager.getCalendar(noteData.calendarId);
                    if (calendar) {
                        newOptions.edit.dateDisplay = <string>FormatDateTime(noteData.startDate, "MMMM DD, YYYY", calendar);
                        if (!DateTheSame(noteData.startDate, noteData.endDate)) {
                            newOptions.edit.dateDisplay += ` - ${FormatDateTime(noteData.endDate, "MMMM DD, YYYY", calendar)}`;
                        }
                        newOptions.edit.allCategories = calendar.noteCategories.map((nc) => {
                            return {
                                text: nc.name,
                                value: nc.name,
                                selected:
                                    this.journalData.flags[ModuleName].noteData.categories.find((c: string) => {
                                        return c === nc.name;
                                    }) !== undefined
                            };
                        });
                    }
                    //Reminders
                    newOptions.edit.reminder =
                        (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.indexOf((<Game>game).user?.id || "") >
                            -1 || noteStub.userReminderRegistered;
                }

                //Macros
                (<Game>game).macros?.forEach((m) => {
                    if (m.canExecute && m.name) {
                        newOptions.edit.macroList[m.id] = m.name;
                    }
                });
                newOptions.edit.selectedMacro = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).macro || noteStub.macro;
            } else {
                newOptions.display.date = noteStub.fullDisplayDate;
                newOptions.display.reminder = noteStub.userReminderRegistered;
                newOptions.display.repeats = noteStub.repeats;
                newOptions.display.repeatsDisplay = GameSettings.Localize(newOptions.edit.repeatOptions[noteStub.repeats] || "");
                newOptions.display.author = noteStub.authorDisplay || { colorText: "", color: "", name: "" };
                newOptions.display.categories = noteStub.categories;
                if (this.isEditable) {
                    newOptions.display.macro = (<Game>game).macros?.get(noteStub.macro)?.name || "";
                }
            }
        }
        return newOptions;
    }

    _getYouTubeVars() {
        const vars: any = { playsinline: 1, modestbranding: 1 };
        if (!this.editMode) {
            vars.controls = this.journalPages[this.uiElementStates.selectedPageIndex].video?.controls ? 1 : 0;
            vars.autoplay = this.journalPages[this.uiElementStates.selectedPageIndex].video?.autoplay ? 1 : 0;
            vars.loop = this.journalPages[this.uiElementStates.selectedPageIndex].video?.loop ? 1 : 0;
            if (this.journalPages[this.uiElementStates.selectedPageIndex].video?.timestamp)
                vars.start = this.journalPages[this.uiElementStates.selectedPageIndex].video?.timestamp;
        }
        return vars;
    }

    _activateVideo() {
        if (this.appWindow) {
            const videoVolume = this.journalPages[this.uiElementStates.selectedPageIndex].video?.volume || 0;
            const videoTimestamp = this.journalPages[this.uiElementStates.selectedPageIndex].video?.timestamp || 0;
            const iframe = this.appWindow.querySelector("iframe");
            if (iframe) {
                (<Game>game).video
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    .getYouTubePlayer(iframe.id, {
                        events: {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            onStateChange: this.youtubeOnStateChange.bind(this, videoVolume)
                        }
                    })
                    .then((player: any) => {
                        if (videoTimestamp) player.seekTo(videoTimestamp, true);
                    });
            }
            const video = this.appWindow.querySelector("video");
            if (video) {
                video.addEventListener("loadeddata", NoteSheet.SetHeight.bind(null, this));
                video.addEventListener("loadedmetadata", this.videoLoadMetadata.bind(this, video, videoVolume, videoTimestamp));
            }
        }
    }

    youtubeOnStateChange(volume: number, e: Event) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (e.data === YT.PlayerState.PLAYING) e.target?.setVolume(volume * 100);
    }

    videoLoadMetadata(video: HTMLVideoElement, volume: number, timeStamp: number) {
        video.volume = volume;
        if (timeStamp) video.currentTime = timeStamp;
    }

    activateListeners() {
        this.appWindow = document.getElementById(`${this.id}`);
        if (this.appWindow) {
            const themes = Themes.map((t) => {
                return t.key;
            });
            this.appWindow.classList.remove(...themes);
            this.appWindow.classList.add(SC.clientSettings.theme);
            if (this.editMode) {
                if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "text") {
                    const editorDiv = <HTMLElement>this.appWindow.querySelector(".editor-content[data-edit]");
                    if (editorDiv) {
                        this.cleanUpProsemirror();
                        (<any>this.object).content = this.journalPages[this.uiElementStates.selectedPageIndex].text?.content || "";
                        this._activateEditor(editorDiv);
                    }
                } else {
                    (<any>this.object).content = "";
                }
                this.appWindow.querySelectorAll("button.file-picker").forEach((e) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (<HTMLElement>e).onclick = this._activateFilePicker.bind(this);
                });
                DateSelectorManager.ActivateSelector(this.dateSelectorId);
                MultiSelect.ActivateListeners(this.categoryMultiSelectId, this.multiSelectOptionChange.bind(this));
                MultiSelect.ActivateListeners(this.playerMultiSelectId, this.multiSelectOptionChange.bind(this));
                this.updateNoteRepeatDropdown();
                //---------------------
                // Input Changes
                //---------------------
                this.appWindow.querySelectorAll("input:not(.fsc-dont-select), select:not(.fsc-dont-select)").forEach((e) => {
                    e.addEventListener("change", this.inputChange.bind(this));
                });
                //---------------------
                //Pages
                //---------------------
                this.appWindow.querySelector(".fsc-add-new-page")?.addEventListener("click", this.addPage.bind(this));
                this.appWindow.querySelectorAll(".fsc-list-of-pages .fsc-delete").forEach((e) => {
                    e.addEventListener("click", this.removePage.bind(this));
                });
            } else {
                this._activateVideo();
                this.appWindow.querySelector("img")?.addEventListener("load", NoteSheet.SetHeight.bind(null, this));
                //---------------------
                // Reminder Button Click
                //---------------------
                this.appWindow.querySelector(".fsc-reminder")?.removeAttribute("disabled");
                this.appWindow.querySelector(".fsc-reminder")?.addEventListener("click", this.reminderChange.bind(this, true));
                this.appWindow.querySelector(".load-pdf button")?.removeAttribute("disabled");
                this.appWindow.querySelector(".load-pdf button")?.addEventListener("click", this._loadPDF.bind(this));
            }
            //---------------------
            // Save/Edit/Delete Buttons
            //---------------------
            this.appWindow.querySelector(".fsc-save")?.addEventListener("click", this.save.bind(this));
            this.appWindow.querySelector(".fsc-note-edit")?.addEventListener("click", this.edit.bind(this));
            this.appWindow.querySelector(".fsc-note-delete")?.addEventListener("click", this.delete.bind(this));

            //---------------------
            // Page List Toggle
            //---------------------
            this.appWindow.querySelector(".fsc-pages")?.addEventListener("click", this.toggleDrawer.bind(this, "fsc-page-list"));
            this.appWindow.querySelectorAll(".fsc-list-of-pages li").forEach((e) => {
                e.addEventListener("click", this.changePage.bind(this));
            });

            //---------------------
            // Page List Search
            //---------------------
            this.appWindow.querySelector(".fsc-page-list .fsc-search-box input")?.addEventListener("input", this.searchUpdate.bind(this));
            this.appWindow.querySelector(".fsc-page-list .fsc-search-box .fsc-control")?.addEventListener("click", this.clearSearch.bind(this));
        }
    }

    protected override _updateObject(event: Event, formData: JournalSheet.FormData): Promise<unknown> {
        if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "text") {
            this.journalPages[this.uiElementStates.selectedPageIndex].text = { content: formData.content };
            this.dirty = true;
        }
        return Promise.resolve();
    }

    /**
     * Toggles the passed in side drawer to show or hide
     * @param selector The unique class name of the drawer we want to toggle
     */
    public toggleDrawer(selector: string) {
        if (this.appWindow) {
            const cList = this.appWindow.querySelector(`.${selector}`);
            if (cList) {
                const member = selector.toLowerCase() as "fsc-page-list";
                this.uiElementStates[member] = animateElement(cList, 500, false);
                const link = cList.querySelector(".fsc-pages");
                if (link) {
                    (<HTMLElement>link).setAttribute(
                        "data-tooltip",
                        this.uiElementStates[member] ? GameSettings.Localize("JOURNAL.ViewCollapse") : GameSettings.Localize("JOURNAL.ViewExpand")
                    );
                    const chev = link.querySelector(".fa-solid");
                    if (chev) {
                        chev.classList.remove("fa-caret-left", "fa-caret-right");
                        chev.classList.add(this.uiElementStates[member] ? "fa-caret-right" : "fa-caret-left");
                    }
                }
            }
        }
    }

    async inputChange(event: Event) {
        await this.writeInputValuesToObjects();
        const target = <HTMLInputElement>event.target;
        const element = target?.closest(".fsc-editor-container")?.querySelector("figure, .fsc-image-placeholder");
        if (target && element && this.inputChangeRedrawNames.indexOf(target.name) > -1) {
            const temp = document.createElement("div");
            const newSource = target.name === "src" ? target.value : undefined;
            if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "image") {
                temp.innerHTML = this.generateImageHTML(newSource);
            } else if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "pdf") {
                temp.innerHTML = await this.generatePDFHTML(newSource, this.editMode);
            } else if (this.journalPages[this.uiElementStates.selectedPageIndex].type === "video") {
                temp.innerHTML = this.generateVideoHTML(newSource);
            }
            if (temp.innerHTML) {
                (<HTMLElement>element).replaceWith(temp.childNodes[0]);
            }
        } else if (target && target.name === "video.volume") {
            const volDisplay = this.appWindow?.querySelector(`label[for="scPageVideoVolume_${this.object.id}"] span`);
            if (volDisplay) {
                volDisplay.innerHTML = `${Math.round(parseFloat(target.value) * 100)}%`;
            }
        }
    }

    _loadPDF(event: Event) {
        const target = (<HTMLElement>event.currentTarget)?.parentElement;
        if (target) {
            const frame = document.createElement("iframe");
            frame.src = `scripts/pdfjs/web/viewer.html?file=${foundry.utils.getRoute(
                this.journalPages[this.uiElementStates.selectedPageIndex].src || ""
            )}`;
            frame.classList.add("fsc-pdf-viewer");
            target.replaceWith(frame);
            NoteSheet.SetHeight(this);
        }
    }

    protected _onResize(event: Event) {
        this.resized = true;
        super._onResize(event);
    }

    private generateImageHTML(src?: string) {
        const source = src || this.journalPages[this.uiElementStates.selectedPageIndex].src;
        let html: string;
        if (source) {
            html = `<figure><img src="${source}" alt="${
                this.journalPages[this.uiElementStates.selectedPageIndex].image?.caption || ""
            }" /><figcaption>${
                this.journalPages[this.uiElementStates.selectedPageIndex].image?.caption || ""
            }</figcaption></figure><div class="fsc-spacer"></div>`;
        } else {
            html = '<div class="fsc-image-placeholder flex-ratio"><i class="fa-solid fa-image"></i></div>';
        }
        return html;
    }

    private async generatePDFHTML(src?: string, edit: boolean = false) {
        const source = src || this.journalPages[this.uiElementStates.selectedPageIndex].src;
        let html: string;
        if (source) {
            if (edit) {
                html = `<iframe class="fsc-pdf-viewer" src="scripts/pdfjs/web/viewer.html?file=${foundry.utils.getRoute(source)}"></iframe>`;
            } else {
                const res = await fetch(source, { method: "HEAD" });
                const size = Number(res?.headers.get("content-length"));
                let sizeText = "";
                if (!isNaN(size)) {
                    sizeText = ` (${(size / 1024 / 1024).toFixed(2)} MB)`;
                }
                html = `<div class="load-pdf"><button type="button" class="fsc-control fsc-secondary">${GameSettings.Localize(
                    "JOURNALENTRYPAGE.PDFLoad"
                )}${sizeText}</button></div>`;
            }
        } else {
            html = '<div class="fsc-image-placeholder flex-ratio"><i class="fa-solid fa-file-pdf"></i></div>';
        }
        return html;
    }

    private generateVideoHTML(src?: string) {
        const source = src || this.journalPages[this.uiElementStates.selectedPageIndex].src;
        let html: string;
        if (source) {
            html = `<figure class="${
                !this.journalPages[this.uiElementStates.selectedPageIndex].video?.width &&
                !this.journalPages[this.uiElementStates.selectedPageIndex].video?.height
                    ? "flex-ratio"
                    : ""
            }">`;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            if ((<Game>game).video.isYouTubeURL(source)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                html += `<iframe id="youtube-${foundry.utils.randomID()}" src="${(<Game>game).video.getYouTubeEmbedURL(
                    source,
                    this._getYouTubeVars()
                )}" ${
                    this.journalPages[this.uiElementStates.selectedPageIndex].video?.width
                        ? `width="${this.journalPages[this.uiElementStates.selectedPageIndex].video?.width}"`
                        : ""
                } ${
                    this.journalPages[this.uiElementStates.selectedPageIndex].video?.height
                        ? `height="${this.journalPages[this.uiElementStates.selectedPageIndex].video?.height}"`
                        : ""
                }></iframe>`;
            } else {
                html += `<video src="${source}" controls ${
                    this.journalPages[this.uiElementStates.selectedPageIndex].video?.width
                        ? `width="${this.journalPages[this.uiElementStates.selectedPageIndex].video?.width}"`
                        : ""
                } ${
                    this.journalPages[this.uiElementStates.selectedPageIndex].video?.height
                        ? `height="${this.journalPages[this.uiElementStates.selectedPageIndex].video?.height}"`
                        : ""
                }></video>`;
            }
            html += `</figure>`;
        } else {
            html = '<div class="fsc-image-placeholder flex-ratio"><i class="fa-solid fa-video"></i></div>';
        }
        return html;
    }

    async dateSelectorSelect(selectedDate: SimpleCalendar.DateTimeSelector.SelectedDates) {
        const calendar = CalManager.getCalendar((<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).calendarId);
        if (calendar) {
            const sMonthIndex = !selectedDate.startDate.month || selectedDate.startDate.month < 0 ? 0 : selectedDate.startDate.month;
            const sDayIndex = !selectedDate.startDate.day || selectedDate.startDate.day < 0 ? 0 : selectedDate.startDate.day;
            let eMonthIndex = !selectedDate.endDate.month || selectedDate.endDate.month < 0 ? 0 : selectedDate.endDate.month;
            let eDayIndex = !selectedDate.endDate.day || selectedDate.endDate.day < 0 ? 0 : selectedDate.endDate.day;

            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).allDay = !selectedDate.timeSelected;

            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).startDate = {
                year: selectedDate.startDate.year || 0,
                month: sMonthIndex,
                day: sDayIndex,
                hour: selectedDate.startDate.hour || 0,
                minute: selectedDate.startDate.minute || 0,
                seconds: selectedDate.startDate.seconds || 0
            };
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).endDate = {
                year: selectedDate.endDate.year || 0,
                month: eMonthIndex,
                day: eDayIndex,
                hour: selectedDate.endDate.hour || 0,
                minute: selectedDate.endDate.minute || 0,
                seconds: selectedDate.endDate.seconds || 0
            };
            this.updateNoteRepeatDropdown();
        }
    }

    multiSelectOptionChange(multiSelectId: string, value: string | null, selected: boolean) {
        if (value !== null) {
            if (multiSelectId === this.categoryMultiSelectId) {
                const index = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).categories.indexOf(value);
                if (selected) {
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).categories.push(value);
                } else if (index > -1) {
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).categories.splice(index, 1);
                }
                this.dirty = true;
            } else if (multiSelectId === this.playerMultiSelectId) {
                if (selected) {
                    const permissionValue = this.journalData.ownership[value];
                    if (permissionValue === undefined || permissionValue < 2) {
                        this.journalData.ownership[value] = 2;
                    } else if (permissionValue === 3) {
                        this.journalData.ownership[value] = 3;
                    }
                    if (value === "default") {
                        (<Game>game).users?.forEach((u) => {
                            const pv = this.journalData.ownership[u.id];
                            if (pv === undefined || pv < 2) {
                                this.journalData.ownership[u.id] = 2;
                            }
                        });
                    }
                } else {
                    this.journalData.ownership[value] = 0;
                    if (value === "default") {
                        (<Game>game).users?.forEach((u) => {
                            const pv = this.journalData.ownership[u.id];
                            if (pv === 2) {
                                this.journalData.ownership[u.id] = 0;
                            }
                        });
                    }
                }
                this.dirty = true;
            }
            this.writeInputValuesToObjects().catch((e) => console.error(e));
        }
    }

    updateNoteRepeatDropdown() {
        if (this.appWindow) {
            const selector = this.appWindow.querySelector(`#scNoteRepeats_${this.object.id}`);
            const noteData = <SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData;
            if (selector && noteData) {
                const calendar = CalManager.getCalendar(noteData.calendarId);
                if (calendar) {
                    //Adjust the repeat options so that you can't repeat if the days between the start and end date are longer than the different options
                    const daysBetween = DaysBetweenDates(calendar, noteData.startDate, noteData.endDate);
                    const options: Record<string, string> = {
                        "0": "FSC.Notes.Repeat.Never",
                        "1": "FSC.Notes.Repeat.Weekly",
                        "2": "FSC.Notes.Repeat.Monthly",
                        "3": "FSC.Notes.Repeat.Yearly"
                    };
                    if (daysBetween >= calendar.totalNumberOfDays(false, true)) {
                        delete options["1"];
                        delete options["2"];
                        delete options["3"];
                    } else if (daysBetween >= calendar.months[noteData.startDate.month].days.length) {
                        delete options["1"];
                        delete options["2"];
                    } else if (daysBetween >= calendar.weekdays.length) {
                        delete options["1"];
                    }
                    let optionsHTML = "";
                    for (const k in options) {
                        const selected = noteData.repeats.toString() === k;
                        optionsHTML += `<option value="${k}" ${selected ? "selected" : ""}>${GameSettings.Localize(options[k])}</option>`;
                    }
                    selector.innerHTML = optionsHTML;
                }
            }
        }
    }

    async writeInputValuesToObjects() {
        let render = false;
        if (this.appWindow) {
            this.journalData.name = getTextInputValue(".fsc-note-title", "New Note", this.appWindow);
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).repeats = <NoteRepeat>(
                getNumericInputValue(`#scNoteRepeats_${this.object.id}`, NoteRepeat.Never, false, this.appWindow)
            );
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).macro = getTextInputValue(
                `#scNoteMacro_${this.object.id}`,
                "none",
                this.appWindow
            );

            const remindMe = getCheckBoxInputValue(`#scRemindMe_${this.object.id}`, false, this.appWindow);
            const user = (<Game>game).user;
            if (user) {
                const userReminded = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.indexOf(user.id) > -1;
                if (remindMe && !userReminded) {
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.push(user.id);
                } else if (!remindMe && userReminded) {
                    const index = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.indexOf(user.id);
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.splice(index, 1);
                }
            }

            this.journalPages[this.uiElementStates.selectedPageIndex].name = getTextInputValue(
                `#scPageName_${this.object.id}`,
                "New Page",
                this.appWindow
            );
            const nType = getTextInputValue(`#scPageType_${this.object.id}`, "text", this.appWindow);
            if (this.journalPages[this.uiElementStates.selectedPageIndex].type !== nType) {
                this.journalPages[this.uiElementStates.selectedPageIndex].type = nType;
                render = true;
            }
            switch (nType) {
                case "text":
                    if (this.editors["content"]) {
                        await this.saveEditor("content");
                    }
                    break;
                case "image":
                    this.journalPages[this.uiElementStates.selectedPageIndex].src = getTextInputValue(
                        `#scPageImageSrc_${this.object.id}`,
                        "",
                        this.appWindow
                    );
                    this.journalPages[this.uiElementStates.selectedPageIndex].image = {
                        caption: getTextInputValue(`#scPageImageCaption_${this.object.id}`, "", this.appWindow)
                    };
                    break;
                case "pdf":
                    this.journalPages[this.uiElementStates.selectedPageIndex].src = getTextInputValue(
                        `#scPagePDFSrc_${this.object.id}`,
                        "",
                        this.appWindow
                    );
                    break;
                case "video": {
                    const h = getNumericInputValue(`#scPageVideoHours_${this.object.id}`, null, false, this.appWindow) || null;
                    const m = getNumericInputValue(`#scPageVideoMinutes_${this.object.id}`, null, false, this.appWindow) || null;
                    const s = getNumericInputValue(`#scPageVideoSeconds_${this.object.id}`, null, false, this.appWindow) || null;
                    const ts = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);

                    this.journalPages[this.uiElementStates.selectedPageIndex].src = getTextInputValue(
                        `#scPageVideoSrc_${this.object.id}`,
                        "",
                        this.appWindow
                    );
                    this.journalPages[this.uiElementStates.selectedPageIndex].video = {
                        controls: getCheckBoxInputValue(`#scPageVideoControls_${this.object.id}`, false, this.appWindow),
                        autoplay: getCheckBoxInputValue(`#scPageVideoAutoplay_${this.object.id}`, false, this.appWindow),
                        loop: getCheckBoxInputValue(`#scPageVideoLoop_${this.object.id}`, false, this.appWindow),
                        volume: getNumericInputValue(`#scPageVideoVolume_${this.object.id}`, 0.5, true, this.appWindow) || 0,
                        height: getNumericInputValue(`#scPageVideoHeight_${this.object.id}`, null, false, this.appWindow),
                        width: getNumericInputValue(`#scPageVideoWidth_${this.object.id}`, null, false, this.appWindow),
                        timestamp: ts
                    };
                    break;
                }
                default:
                    break;
            }
            this.dirty = true;
            if (render) {
                this.render(true);
            }
        }
    }

    async reminderChange(renderNote: boolean = true) {
        const user = (<Game>game).user;
        if (user) {
            const userId = user.id;
            //If the current user can edit the journal entry, then just edit it
            if ((<JournalEntry>this.object).testUserPermission(user, 3)) {
                const userIndex = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.indexOf(userId);
                if (userId !== "" && userIndex === -1) {
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.push(userId);
                } else if (userId !== "" && userIndex !== -1) {
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.splice(userIndex, 1);
                }
                await (<JournalEntry>this.object).update(this.journalData);
            }
            //Otherwise, we need to send it to the GM to make the change
            else {
                const socket = <SimpleCalendar.SimpleCalendarSocket.Data>{
                    type: SocketTypes.noteUpdate,
                    data: {
                        userId: userId,
                        journalId: (<JournalEntry>this.object).id
                    }
                };
                await GameSockets.emit(socket);
            }
            if (renderNote) {
                this.render(true);
            }
            MainApplication.updateApp();
        }
    }

    searchUpdate(e: Event) {
        const target = e.target;
        if (target) {
            this.uiElementStates.search.term = (<HTMLInputElement>target).value;
            this.searchPages();
        }
    }

    clearSearch() {
        this.uiElementStates.search.term = "";
        if (this.appWindow) {
            const searchBox = <HTMLInputElement>this.appWindow.querySelector(".fsc-page-list .fsc-search-box input");
            if (searchBox) {
                searchBox.value = "";
            }
        }
        this.searchPages();
    }

    searchPages() {
        const pageToHide = this.journalPages.filter((p) => {
            return p.name.indexOf(this.uiElementStates.search.term) === -1;
        });
        this.journalPages.forEach((p) => {
            p.show = true;
        });
        this.appWindow?.querySelectorAll(`.fsc-list-of-pages li`).forEach((e) => {
            return e.classList.remove("fsc-hide");
        });
        if (pageToHide.length) {
            for (let i = 0; i < pageToHide.length; i++) {
                pageToHide[i].show = false;
                this.appWindow?.querySelector(`.fsc-list-of-pages li[data-index="${pageToHide[i]._id}"]`)?.classList.add("fsc-hide");
            }
            this.appWindow?.querySelector(".fsc-page-list-controls .fsc-search-box .fsc-control")?.classList.remove("fsc-hide");
        } else {
            this.appWindow?.querySelector(".fsc-page-list-controls .fsc-search-box .fsc-control")?.classList.add("fsc-hide");
        }
    }

    async edit(e: Event) {
        e.preventDefault();
        this.resized = false;
        this.editMode = true;
        this.uiElementStates["fsc-page-list"] = true;
        this.render(true);
    }

    changePage(e: Event) {
        const target = (<HTMLElement>e.target)?.closest("li");
        if (target) {
            const id = target.getAttribute("data-index");
            if (id) {
                const jpIndex = this.journalPages.findIndex((j) => {
                    return j._id === id;
                });
                if (jpIndex > -1) {
                    this.uiElementStates.selectedPageIndex = jpIndex;
                    this.render(true);
                }
            }
        }
    }

    async addPage() {
        this.journalPages.push({ _id: foundry.utils.randomID(), show: true, name: "New Page", type: "text", text: { content: "" } });
        this.uiElementStates.selectedPageIndex = this.journalPages.length - 1;
        this.dirty = true;
        this.render(true);
    }

    async removePage(e: Event) {
        const target = (<HTMLElement>e.target)?.closest("li");
        if (target) {
            const id = target.getAttribute("data-index");
            if (id) {
                const jpIndex = this.journalPages.findIndex((j) => {
                    return j._id === id;
                });
                if (jpIndex > -1) {
                    this.journalPages.splice(jpIndex, 1);
                    if (this.uiElementStates.selectedPageIndex >= this.journalPages.length) {
                        this.uiElementStates.selectedPageIndex = this.journalPages.length - 1;
                    }
                }
                this.dirty = true;
                this.render(true);
            }
        }
    }

    async save(e: Event) {
        e.preventDefault();
        await this.writeInputValuesToObjects();
        (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).fromPredefined = false;
        await (<JournalEntry>this.object).update(this.journalData, { render: false, renderSheet: false });

        //Get all pages currently saved in the journal entry
        const pages = (<JournalEntry>this.object).getEmbeddedCollection("JournalEntryPage").contents;

        //Remove any pages that do not exist in our journal pages list (these were removed)
        for (let i = 0; i < pages.length; i++) {
            const index = this.journalPages.findIndex((jp) => {
                return jp._id === pages[i].id;
            });
            if (index === -1) {
                await pages[i].delete({ render: false, renderSheet: false });
            }
        }

        //Add and update any pages that remain in our journal page list
        for (let i = 0; i < this.journalPages.length; i++) {
            const p = pages.find((p) => {
                return p.id === this.journalPages[i]._id;
            });
            if (p) {
                await (<JournalEntry>this.object).updateEmbeddedDocuments(
                    "JournalEntryPage",
                    [
                        {
                            _id: this.journalPages[i]._id,
                            name: this.journalPages[i].name,
                            type: this.journalPages[i].type,
                            text: { content: this.journalPages[i].text?.content || "", format: 1, markdown: undefined },
                            src: this.journalPages[i].src || "",
                            image: { caption: this.journalPages[i].image?.caption || "" },
                            video: this.journalPages[i].video
                        }
                    ],
                    { render: false, renderSheet: false }
                );
            } else {
                await this.object.createEmbeddedDocuments(
                    "JournalEntryPage",
                    [
                        {
                            text: { content: this.journalPages[i].text?.content || "", format: 1, markdown: undefined },
                            name: this.journalPages[i].name,
                            type: this.journalPages[i].type,
                            src: this.journalPages[i].src || "",
                            image: { caption: this.journalPages[i].image?.caption || "" },
                            video: {
                                autoplay: this.journalPages[i].video?.autoplay || false,
                                controls: this.journalPages[i].video?.controls || false,
                                height: this.journalPages[i].video?.height || null,
                                loop: this.journalPages[i].video?.loop || false,
                                timestamp: this.journalPages[i].video?.timestamp || 0,
                                volume: this.journalPages[i].video?.volume || 0.5,
                                width: this.journalPages[i].video?.width || null
                            }
                        }
                    ],
                    { render: false, renderSheet: false }
                );
            }
        }
        MainApplication.updateApp();
        await GameSockets.emit({ type: SocketTypes.mainAppUpdate, data: {} });
        this.resized = false;
        this.editMode = false;
        this.dirty = false;
        this.render(true);
    }

    delete(e: Event) {
        e.preventDefault();
        const dialog = new Dialog({
            title: GameSettings.Localize("FSC.DeleteConfirm"),
            content: GameSettings.Localize("FSC.DeleteConfirmText"),
            buttons: {
                yes: {
                    icon: '<i class="fas fa-trash"></i>',
                    label: GameSettings.Localize("FSC.Delete"),
                    callback: this.deleteConfirm.bind(this)
                },
                no: {
                    icon: '<i class="fas fa-times"></i>',
                    label: GameSettings.Localize("FSC.Cancel")
                }
            },
            default: "no"
        });
        dialog.render(true);
    }

    async deleteConfirm() {
        this.dirty = false;
        NManager.removeNoteStub(<JournalEntry>this.object);
        MainApplication.updateApp();
        await (<JournalEntry>this.object).delete();
        await GameSockets.emit({ type: SocketTypes.mainAppUpdate, data: {} });
        await this.close();
    }
}
