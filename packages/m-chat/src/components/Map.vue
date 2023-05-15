<template>
    <div class="mc-map">
        <div class="mc-map__tools">
            <van-button class="mc-map__tools-btn calcel" @click="clickCancel">取消</van-button>
            <van-button class="mc-map__tools-btn submit" type="success" @click="clickSend">发送</van-button>
        </div>
        <div id="mChatMap">

        </div>
        <div class="mc-map__panel">
            <!-- <div class="mc-map__panel-item" v-for="(item, index) in state.infos" :key="index">
                {{ item.address }}
            </div> -->
            <div class="mc-map__panel-item">
                <div class="mc-map__address"> {{ state.location.address }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="McMap">
import AMapLoader from '@amap/amap-jsapi-loader';
import { Emitter } from 'mitt';
import { reactive, PropType, onMounted, inject } from 'vue';
import { Toast, Button as VanButton } from 'vant'
import * as eventsConst from '../utils/events.const';

// const props = defineProps({

// })
const state = reactive({
    location: {
        lonlat: [113.86697, 22.567978],
        address: '广东省深圳市宝安区西乡街道宝源路177号华源科技创新园 '
    },
    infos: []
})
const emitter = inject<Emitter<any>>('emitter');
let map;
let geocoder;


//解析定位结果
function onComplete(data) {
    console.log('定位成功:', data)
    // document.getElementById('status').innerHTML = '定位成功'
    // var str = [];
    // str.push('定位结果：' + data.position);
    // str.push('定位类别：' + data.location_type);
    // if (data.accuracy) {
    //     str.push('精度：' + data.accuracy + ' 米');
    // }//如为IP精确定位结果则没有精度信息
    // str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    // document.getElementById('result').innerHTML = str.join('<br>');

    state.location.lonlat = [data.position.lng, data.position.lat];

    geocoder.getAddress(data.position, function (status, result) {
        if (status === 'complete' && result.regeocode) {
            var address = result.regeocode.formattedAddress;
            state.location.address = address;
        } else {
            console.error('根据经纬度查询地址失败')
        }
    });

}
//解析定位错误信息
function onError(data) {
    console.log('定位失败:', data)
    // document.getElementById('status').innerHTML = '定位失败'
    // document.getElementById('result').innerHTML = '失败原因排查信息:' + data.message + '</br>浏览器返回信息：' + data.originMessage;
    Toast.fail('定位失败')
}

const clickSend = () => {
    emitter.emit(eventsConst.CLICK_MAP_SEND, state.location)
}
const clickCancel = () => {
    emitter.emit(eventsConst.CLICK_MAP_CANCEL)
}

onMounted(async () => {
    const AMap: any = await AMapLoader.load({
        "key": "599dfe6bbe92b35d34d4e3d3f40aac6b",              // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": [
            'AMap.Geolocation'
        ],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {             // 是否加载 AMapUI，缺省不加载
            "version": '1.1',   // AMapUI 版本
            "plugins": ['misc/PositionPicker'],       // 需要加载的 AMapUI ui插件
        }
    })
    map = new AMap.Map('mChatMap');

    AMap.plugin("AMap.Geocoder", function () {
        geocoder = new AMap.Geocoder();
    })

    const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        position: 'RB',    //定位按钮的停靠位置
        offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition(function (status, result) {
        if (status == 'complete') {
            onComplete(result)
        } else {
            onError(result)
        }
    });

    return;
    AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
        const positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map
        });

        positionPicker.on('success', function (positionResult) {
            // document.getElementById('lnglat').innerHTML = positionResult.position;
            // document.getElementById('address').innerHTML = positionResult.address;
            // document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
            // document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
            // document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;
            state.infos = [{
                lnglat: positionResult.position,
                address: positionResult.address,
                nearestJunction: positionResult.nearestJunction,
                nearestRoad: positionResult.nearestRoad,
                nearestPOI: positionResult.nearestPOI
            }]
        });

        positionPicker.start();
    })


})
</script>
<style lang="scss">
.mc-map {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;


    &__tools {
        position: absolute;
        top: 20px;
        left: 30px;
        right: 30px;
        display: flex;
        justify-content: space-between;
        z-index: 11;

        &-btn {
            width: 80px;
            height: 30px;
        }
    }

    &__panel {
        height: 20%;
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;

        overflow-y: auto;

        &-item {
            padding: 10px 0px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f5f5f5;
        }
    }

    &__address {
        font-size: 4vw;
    }
}

#mChatMap {
    height: calc(100% - 20%);
    background-color: #fff;
    z-index: 10;
}
</style>