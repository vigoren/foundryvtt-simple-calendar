const ProseMirror = {
    ProseMirrorMenu: {build: () => {return {}}},
    ProseMirrorKeyMaps: {build: () => {return {}}},
    ProseMirrorInputRules: {build: () => {return {}}},
    defaultSchema: {},
    dom: {serializeString: (s: string) => {return s;}}
}

//@ts-ignore
global.ProseMirror = ProseMirror;