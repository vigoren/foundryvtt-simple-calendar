"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedoc_1 = require("typedoc");

class LoggingTheme extends typedoc_1.DefaultTheme {
    render(page) {
        this.application.logger.info(`Rendering ${page.url}`);
        return super.render(page);
    }
}

function load(app) {
    // Hooks can be used to inject some HTML without fully overwriting the theme.
    app.renderer.hooks.on("body.begin", (_) => (typedoc_1.JSX.createElement("script", null, typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: "console.log(`Loaded ${location.href}`)" }))));

    // Or you can define a custom theme. This one behaves exactly like the default theme,
    // but logs a message when rendering a page.
    app.renderer.defineTheme("logging", LoggingTheme);

    // While this one overwrites the footer to include custom content.
    //app.renderer.defineTheme("footer", FooterOverrideTheme);
}

exports.load = load;