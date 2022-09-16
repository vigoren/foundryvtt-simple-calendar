module.exports = {
    localesPath: 'src/lang',
    localeNameResolver: (name) => {return name === 'en.json';},
    srcPath: 'src',
    srcExtensions: ['ts', 'hbs'],
    ignorePaths: ['src/lang'],
    translationKeyMatcher: /['"`](FSC\..*?)['"`]/gi,
    flatTranslations: true
};