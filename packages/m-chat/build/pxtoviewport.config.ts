export const vantPxtovwConfig = {
    unitToConvert: "px", // 要转化的单位
    viewportWidth: 375, // UI设计稿的宽度
    unitPrecision: 6, // 转换后的精度，即小数点位数
    propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
    fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
    selectorBlackList: ["ignore"], // 指定不转换为视窗单位的类名，
    minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
    mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
    replace: true, // 是否转换后直接更换属性值
    exclude: [/^(?!.*node_modules\/vant)/], // 设置忽略文件，用正则做目录名匹配
    landscape: false, // 是否处理横屏情况
};
export const basePxtovwConfig = {
    unitToConvert: "px", // 需要转换的单位，默认为"px"
    viewportWidth: 750,
    unitPrecision: 5, // 单位转换后保留的精度
    propList: ["*"], // 能转化为vw的属性列表
    viewportUnit: "vw", //  希望使用的视口单位
    fontViewportUnit: "vw", // 字体使用的视口单位
    selectorBlackList: ["van-"], // 需要忽略的CSS选择器
    minPixelValue: 1, // 最小的转换数值，如果为1的话，只有大于1的值会被转换
    mediaQuery: false, // 媒体查询里的单位是否需要转换单位
    replace: true, // 是否直接更换属性值，而不添加备用属性
    // exclude: /node_modules/, // 忽略某些文件夹下的文件或特定文件
    include: undefined, // 如果设置了include，那将只有匹配到的文件才会被转换，例如只转换 'src/mobile' 下的文件 (include: /\/src\/mobile\//)
    landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
    landscapeUnit: "vw", // 横屏时使用的单位
    landscapeWidth: 568, // 横屏时使用的视口宽度
}