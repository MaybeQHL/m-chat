export type MessageData = {
    id: string | number;
    name?: string | number;
    avatar?: string;
    self?: boolean;
    type?: string;
    content: {
        [key: string]: any;
        text?: string;
        duration?: string | number;
        imageUrl?: string;
        videoUrl?: string;
        audioUrl?: string;
        fileUrl?: string;
        fileName?: string;
        fileSize?: string;
        fileExt?: string;
        location?: string;
        locationLonLat?: any[];
    };
    isCancel?: boolean;
    time?: string;
};
export type CommonFileConf = {
    /**
     * 文件大小限制，单位为 kb
     */
    maxSize?: number;
    /**
     * 允许的文件类型
     */
    accept?: string[];
};
export interface PanelItem {
    type: string;
    text: string;
    icon: string;
}
export interface Config {
    /**
     * 主题
     * 默认亮色(light)
     */
    theme?: 'light' | 'dark';
    /**
   * 图片上传配置(vant)
   * @doc vant-uploader  https://vant-contrib.gitee.io/vant/#/zh-CN/uploader#props
   * @warn 如果和imageUploader中的配置存在冲突那么以imageUploader为准
   */
    vanImageUploader?: any;
    /**
 * 文件上传配置(vant)
 * @doc vant-uploader  https://vant-contrib.gitee.io/vant/#/zh-CN/uploader#props
 */
    vanFileUploader?: any;
    /**
* 视频上传配置(vant)
* @doc vant-uploader  https://vant-contrib.gitee.io/vant/#/zh-CN/uploader#props
*/
    vanVideoUploader?: any;
    /**
    * 图片上传配置
    * @wraning 如和vant配置进行了冲突此配置优先级高于vant
    */
    imageUploader?: {} & CommonFileConf;
    /**
     * 文件上传配置
     */
    fileUploader?: {} & CommonFileConf;
    /**
     * 视频上传配置
     */
    videoUploader?: {} & CommonFileConf;
    /**
     * 开放的功能
     */
    open?: string[];
    /**
     * 图片预览配置(vant)
     * @doc https://vant-contrib.gitee.io/vant/#/zh-CN/image-preview
     */
    vanImagePreview?: {};
    /**
     * （微信原生浏览器不支持浏览器下载需引导至其他浏览器）
     * 网页下载引导页面 例: http://www.xxx.com/leadPage 会跳转到 http://www.xxx.com/leadPage?url='xxx'&name='xxxxx', 注意: 参数需要用decodeComponent()解密
     */
    leadPage?: string;
    /**
     * 用于提供下拉刷新的交互操作。
     * @returns
     */
    refresh?: () => any;
    /**
     * 扩展主面板功能
     * @demo  [{
        type: "location",
        text: "定位",
        icon: "location-o" // 支持http(s)地址或者vant自带的icon
    }]
     * @description 配置此选项将额外的功能item添加到列表中
     */
    extPanelItems?: PanelItem[];
    /**
     * 高德地图配置
     */
    amap?: {
        /**
         * 高德地图key
         */
        key: string;
    };
}
