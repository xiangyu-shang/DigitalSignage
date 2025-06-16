/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
  appId: 'com.digitalsignage.app',
  productName: '咖啡及饮品商品展示系统',
  directories: {
    output: 'release',
    buildResources: 'build',
    app: '.'
  },
  files: [
    'dist/**/*',
    'src/main/**/*',
    'package.json',
    'electron-custom-config.js',
    'node_modules/**/*',
    '!node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
    '!node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
    '!node_modules/**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
    '!node_modules/.bin',
    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
    '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
    '!**/{appveyor.yml,.travis.yml,circle.yml}',
    '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}'
  ],
  extraResources: [
    {
      from: 'public',
      to: 'public',
    }
  ],
  asar: true,
  asarUnpack: [
    'node_modules/electron-updater'
  ],
  win: {
    target: ['portable', 'nsis'],
    icon: 'public/icon.ico',
    artifactName: '${productName}-${version}.${ext}',
    publisherName: '数字标牌系统',
    signAndEditExecutable: false
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'public/icon.ico',
    uninstallerIcon: 'public/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "咖啡及饮品展示",
    runAfterFinish: true,
    artifactName: '${productName} Setup.${ext}',
    menuCategory: '咖啡及饮品展示系统',
    perMachine: false
  },
  portable: {
    artifactName: "${productName}.${ext}",
    requestExecutionLevel: "user",
    splashImage: "public/splash.bmp"
  },
  mac: {
    target: ['dmg'],
    icon: 'public/icon.icns',
    category: 'public.app-category.business'
  },
  linux: {
    target: ['AppImage'],
    icon: 'public/icon.png',
    category: 'Office'
  },
  publish: null,
  extraMetadata: {
    main: 'src/main/index.js',
  },
  afterPack: function(context) {
    console.log('打包后处理完成，即将准备构建安装程序...');
    return Promise.resolve();
  },
  afterAllArtifactBuild: function(buildResult) {
    console.log('所有构建完成，生成的文件:');
    console.log(buildResult.artifactPaths);
    return Promise.resolve();
  },
  nodeGypRebuild: false,
  buildDependenciesFromSource: true,
  npmRebuild: true
}; 