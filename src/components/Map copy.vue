<template>
    <div class="com-container">
        <div class="com-chart" ref="map_ref"></div>
    </div>
</template>

<script>
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
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initData() {
            this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk');
            var initOption = {

            }
            this.chartInstance.setOption(initOption);
            window.addEventListener('resize', this.screenAdapter)
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
            this.screenAdapter();
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