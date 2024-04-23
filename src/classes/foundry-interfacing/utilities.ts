export function foundryMergeObject(
    original: {},
    other?: any,
    options?: {
        insertKeys: boolean;
        insertValues: boolean;
        overwrite: boolean;
        recursive: boolean;
        inplace: boolean;
        enforceTypes: boolean;
        performDeletions: boolean;
    },
    _d?: number
) {
    if (foundry && foundry.utils && foundry.utils.mergeObject) {
        return foundry.utils.mergeObject(original, other, options, _d);
    } else {
        return mergeObject(original, other, options, _d);
    }
}

export function foundryGetRoute(path: string, { prefix }: { prefix?: string | null } = {}) {
    if (foundry && foundry.utils && foundry.utils.getRoute) {
        return foundry.utils.getRoute(path, { prefix });
    } else {
        return getRoute(path, { prefix });
    }
}
