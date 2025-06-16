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
  win: { 
    target: ['portable', 'nsis'], 
    icon: 'public/icon.ico' 
  }, 
  portable: { 
    artifactName: '${productName}.${ext}', 
  }, 
  nsis: { 
    oneClick: false, 
    allowToChangeInstallationDirectory: true, 
    createDesktopShortcut: true, 
    createStartMenuShortcut: true, 
  }, 
  publish: null, 
  extraMetadata: { 
    main: 'src/main/index.js', 
  }, 
  electronDownload: { 
    mirror: 'https://npmmirror.com/mirrors/electron/' 
  } 
}; 
