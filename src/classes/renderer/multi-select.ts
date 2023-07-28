import { deepMerge } from "../utilities/object";

export default class MultiSelect {
    private static defaultOptions: SimpleCalendar.Renderer.MultiSelectOptions = {
        id: "",
        options: []
    };

    private static clickedElement = "";

    public static Render(options: SimpleCalendar.Renderer.MultiSelectOptions = { id: "", options: [] }, open: boolean = false): string {
        options = deepMerge({}, this.defaultOptions, options);
        const selectedValues = options.options
            .filter((o) => {
                return o.selected;
            })
            .map((o) => {
                return o.value;
            })
            .join("|");
        const selectedText =
            options.options
                .filter((o) => {
                    return o.selected;
                })
                .map((o) => {
                    return o.text;
                })
                .join(", ") || "None Selected";
        let html = `<div class="fsc-multiselect"><input class="fsc-multiselect-id" id="${options.id}" value="${selectedValues}" type="hidden" />`;
        html += `<input class="fsc-render-options" type="hidden" value="${encodeURIComponent(JSON.stringify(options))}"/>`;

        html += `<button><div class="fsc-selected-options">${selectedText}</div><i class="fa fa-chevron-down"></i></button><ul class="fsc-multi-select-options ${
            open ? "fsc-show" : ""
        }">`;
        for (let i = 0; i < options.options.length; i++) {
            html += `<li class="${options.options[i].disabled ? "fsc-disabled" : ""} ${
                options.options[i].selected ? "fsc-selected" : ""
            }" data-value="${options.options[i].value}"><span class="fa-solid ${
                options.options[i].selected ? "fa-square-check" : "fa-square"
            }"></span>${options.options[i].text}</li>`;
        }
        html += `</ul></div>`;
        return html;
    }

    public static ActivateListeners(multiSelectId: string, onOptionChange: (multiSelectId: string, value: string | null, selected: boolean) => void) {
        const multiSelect = document.getElementById(multiSelectId)?.parentElement;
        if (multiSelect) {
            multiSelect
                .querySelector("button")
                ?.addEventListener("click", MultiSelect.EventListener.bind(MultiSelect, multiSelectId, "button", onOptionChange));
            multiSelect.querySelectorAll("li").forEach((e) => {
                e.addEventListener("click", MultiSelect.EventListener.bind(MultiSelect, multiSelectId, "option", onOptionChange));
            });
        }
    }

    public static EventListener(
        multiSelectId: string,
        type: string,
        onOptionChange: (multiSelectId: string, value: string | null, selected: boolean) => void,
        event: Event
    ) {
        const multiSelect = document.getElementById(multiSelectId)?.parentElement;
        if (multiSelect) {
            if (type === "button") {
                MultiSelect.clickedElement = multiSelectId;
                const options = multiSelect.querySelector(".fsc-multi-select-options");
                if (options) {
                    if (options.classList.contains("fsc-show")) {
                        options.classList.remove("fsc-show");
                    } else {
                        options.classList.add("fsc-show");
                    }
                }
            } else if (type === "option") {
                event.stopPropagation();
                const target = (<HTMLElement>event.target)?.closest("li");
                let renderOptions: SimpleCalendar.Renderer.MultiSelectOptions = { id: "", options: [] };
                const rawRenderOptions = (<HTMLInputElement>multiSelect.querySelector(".fsc-render-options"))?.value;
                if (target && !(<HTMLElement>target).classList.contains("fsc-disabled") && rawRenderOptions) {
                    renderOptions = JSON.parse(decodeURIComponent(rawRenderOptions));

                    const value = (<HTMLElement>target).getAttribute("data-value");
                    const selected = !(<HTMLElement>target).classList.contains("fsc-selected");

                    const optionIndex = renderOptions.options.findIndex((o: SimpleCalendar.Renderer.MultiSelectOption) => {
                        return o.value === value;
                    });
                    if (optionIndex > -1) {
                        renderOptions.options[optionIndex].selected = selected;
                        if (renderOptions.options[optionIndex].makeOthersMatch) {
                            renderOptions.options.forEach((o, index) => {
                                if (!o.static && index !== optionIndex) {
                                    o.selected = selected;
                                    o.disabled = selected;
                                }
                            });
                        }
                    }

                    const newHtml = MultiSelect.Render(renderOptions, true);
                    const temp = document.createElement("div");
                    temp.innerHTML = newHtml;
                    if (temp.firstChild) {
                        multiSelect.replaceWith(temp.firstChild);
                        MultiSelect.ActivateListeners(multiSelectId, onOptionChange);
                    }
                    if (onOptionChange) {
                        onOptionChange(multiSelectId, value, selected);
                    }
                }
            }
        }
    }

    public static BodyEventListener() {
        document.querySelectorAll(".fsc-multiselect").forEach((ms) => {
            const msId = ms.querySelector(".fsc-multiselect-id")?.id;
            if (msId) {
                if (msId !== MultiSelect.clickedElement) {
                    const options = ms.querySelector(".fsc-multi-select-options");
                    if (options) {
                        options.classList.remove("fsc-show");
                    }
                } else {
                    MultiSelect.clickedElement = "";
                }
            }
        });
    }
}
