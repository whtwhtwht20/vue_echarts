<template>
    <div class="com-container">
        <div class="com-chart" ref="map_ref"></div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Map',
    data() {
        return {
            chartInstance: null,
        }
    },
    mounted() {
        this.initData();
        this.getData();
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        async initData() {
            this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk');
            // 获得中国地图的矢量数据
            const ret = await axios.get('http://localhost:8999/static/map/china.json');
            // 注册地图数据
            this.$echarts.registerMap('china', ret.data);
            const initOption = {
                geo: {
                    type: 'map',
                    map: 'china'
                }
            }
            this.chartInstance.setOption(initOption);
        },
        getData() {
            const { data:ret } = this.$axios.get('map');
            this.allData = ret;
            this.updataChart();
        },
        updataChart() {
            var dataOption = {

            }
            this.chartInstance.setOption(dataOption);
        },
        screenAdapter() {
            const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6;
            var adapterOption = {

            }
            this.chartInstance.setOption(adapterOption);
            this.chartInstance.resize();
        }
    }
}
</script>

<style>

</style>