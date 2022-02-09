<template>
    <div class="com-container">
        <div class="com-chart" ref="hot_ref"></div>
        <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{currentTitle}}</span>
    </div>
</template>

<script>
export default {
    name: 'Hot',
    data() {
        return {
            chartInstance: null,
            allData: [],
            currentIndex: 0,
            titleFontSize: 0
        }
    },
    created() {
        this.$socket.registerCallBack('hotData', this.getData);
    },
    computed: {
        selectTypeArr() {
            if (this.allData.length > 0) {
                return this.allData.map(item => item.name);
            }
        },
        currentTitle() {
            if (this.allData.length > 0) {
                return this.allData[this.currentIndex].name;
            } else {
                return ''
            }
        },
        comStyle() {
            return {
                fontSize: this.titleFontSize + 'px'
            }
        }
    },
    mounted() {
        this.initData();
        // this.getData();
        this.$socket.send({
            action: 'getData',
            socketType: 'hotData',
            chartName: 'hotproduct',
            value: ''
        });
        window.addEventListener('resize', this.screenAdapter)

    },
    destroyed() {
        this.$socket.unRegisterCallBack('hotData');
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initData() {
            this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk');
            var initOption = {
                title: {
                    text: '▏热销商品的占比',
                    left: 20,
                    top: 20
                },
                legend: {
                    icon: 'circle',
                    top: '15%'
                },
                tooltip: {
                    show: true,
                    formatter(arg) {
                        const thirdCategory = arg.data.children;
                        let total = 0;
                        thirdCategory.forEach((item, index) => {
                            total += item.value;
                        })
                        let content = '';
                        thirdCategory.forEach((item, index) => {
                            content = content + item.name + ':' + parseInt(item.value / total * 100) + '%';
                            if(index != thirdCategory.length - 1) content += '<br/>'
                        })
                        return content;
                    }
                },
                series:[
                    {
                        type: 'pie',
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        },
                        labelLine: {
                            show: false
                        }
                        
                    }
                ],
            }
            this.chartInstance.setOption(initOption);
        },
        getData(ret) {
            // const { data: ret } = await this.$axios.get('hotproduct');
            this.allData = ret;
            this.updataChart();
        },
        updataChart() {
            const seriesData = this.allData[this.currentIndex].children.map(item => {
                return {
                    value: item.value,
                    name: item.name,
                    children: item.children
                }
            });
            const legendData = this.allData[this.currentIndex].children.map(item => item.name);
            const dataOption = {
                series:[
                    {
                        data: seriesData
                    }
                ],
                legend: {
                    data: legendData
                }
            }
            this.chartInstance.setOption(dataOption);
            this.screenAdapter();
        },
        screenAdapter() {
            this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6;
            var adapterOption = {
                title: {
                    textStyle: {
                        fontSize: this.titleFontSize
                    }
                },
                series: [
                    {
                        radius: this.titleFontSize * 4.5,
                        center: ['50%','56%']
                    }
                ],
                legend: {
                    itemWidth: this.titleFontSize,
                    itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize / 2,
                    textStyle: {
                        fontSize: this.titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption);
            this.chartInstance.resize();
        },
        toLeft() {
            this.currentIndex--;
            if (this.currentIndex < 0) this.currentIndex = this.allData.length - 1;
            this.updataChart();
        },
        toRight() {
            this.currentIndex++;
            if (this.currentIndex > (this.allData.length - 1)) this.currentIndex = 0;
            this.updataChart();
        }
    }
}
</script>

<style>
    .arr-left {
        position: absolute;
        left: 10%;
        top: 50%;
        transform: translateY(-50%) !important;
        cursor: pointer;
        color: white;
    }
    .arr-right {
        position: absolute;
        right: 10%;
        top: 50%;
        transform: translateY(-50%) !important;
        cursor: pointer;
        color: white;
    }
    .cat-name {
        position: absolute;
        left: 80%;
        bottom: 20px;
        color: white;
    }
</style>