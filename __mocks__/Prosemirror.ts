const ProseMirror = {
    ProseMirrorMenu: {build: () => {return {}}},
    ProseMirrorKeyMaps: {build: () => {return {}}},
    ProseMirrorInputRules: {build: () => {return {}}},
    defaultSchema: {},
    dom: {serializeString: (s: string) => {return s;}},
    create: (div: any, content: string) => {return {destroy: () => {}};}
}

//@ts-ignore
global.ProseMirror = ProseMirror;