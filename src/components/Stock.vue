<template>
    <div class="com-container">
        <div class="com-chart" ref="stock_ref"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Stock',
    data() {
        return {
            chartInstance: null,
            allData: [],
            currentIndex: 0,
            timeId: null
        }
    },
    created() {
        this.$socket.registerCallBack('stockData', this.getData);
    },
    mounted() {
        this.initChart();
        // this.getData();
        this.$socket.send({
            action: 'getData',
            socketType: 'stockData',
            chartName: 'stock',
            value: ''
        });
        window.addEventListener('resize', this.screenAdapter)
        this.startInterval();
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
        clearInterval(this.timeId);
        this.$socket.unRegisterCallBack('trendData');
    },
    methods: {
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme);
            this.chartInstance.on('mousemove', () => {
                if (this.timeId) {
                    clearInterval(this.timeId);
                    this.timeId = null;
                }
            });
            this.chartInstance.on('mouseout', () => {
                if (!this.timeId) this.startInterval();
            });
            var initOption = {
                title: {
                    text: '▏库存和销量分析',
                    left: 20,
                    top:20
                }
            }
            this.chartInstance.setOption(initOption);
        },
        getData(ret) {
            // const { data:ret } = await this.$axios.get('stock');
            this.allData = ret;
            this.updateChart();
        },
        updateChart() {
            const centerArr = [
                ['18%', '40%'],
                ['50%', '40%'],
                ['82%', '40%'],
                ['34%', '75%'],
                ['66%', '75%']
            ]
            const colorArr = [
                ['#4FF778', '#0BA82C'],
                ['#E5DD45', '#E8B11C'],
                ['#E8821C', '#E55445'],
                ['#5052EE', '#AB6EE5'],
                ['#23E5E5', '#2E72BF']
            ]
            const showData = this.allData.slice(this.currentIndex * 5, (this.currentIndex + 1) * 5);
            const seriesArr = showData.map((item, index) => {
                return {
                    type: 'pie',
                    center: centerArr[index],
                    label: {
                        position: 'center',
                        color: colorArr[index][0],
                    },
                    data: [
                        {
                            name: item.name + '\n\n' + item.sales,
                            value: item.sales,
                            itemStyle: {
                                color: new this.$echarts.graphic.LinearGradient(0,1,0,0,[
                                    {
                                        offset: 0,
                                        color: colorArr[index][0],
                                    },
                                    {
                                        offset: 1,
                                        color: colorArr[index][1],
                                    }
                                ])
                            }
                        },
                        {
                            value: item.stock,
                            itemStyle: {
                                color: '#333843'
                            }
                        }
                    ],
                    hoverAnimation: false, // 关闭鼠标动态效果
                    labelLine: {
                        show: false
                    }
                }
            })
            var dataOption = {
                series: seriesArr
            }
            this.chartInstance.setOption(dataOption);
            this.screenAdapter();
        },
        screenAdapter() {
            const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6;
            const innerRadius = titleFontSize * 2.8;
            const outterRadius = innerRadius * 1.125;
            const seriesArr = this.allData.map(() => {
                return {
                    radius: [outterRadius, innerRadius],
                    label: {
                        fontSize: titleFontSize / 2
                    }
                }
            })
            var adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    }
                },
                series: seriesArr
            }
            this.chartInstance.setOption(adapterOption);
            this.chartInstance.resize();
        },
        startInterval() {
            if (this.timeId) {
                clearInterval(this.timeId);
                this.timeId = null;
            }
            this.timeId = setInterval(()=> {
                this.currentIndex++;
                if (this.currentIndex > (this.allData.length / 5 - 1)) {
                    this.currentIndex = 0;
                }
                this.updateChart();
            }, 3000)
        }
    },
    computed: {
        ...mapState(['theme']),
    },
    watch: {
        theme() {
        console.log('主题切换了')
        // 销毁当前的图表
        this.chartInstance.dispose()
        // 以最新主题初始化图表对象
        this.initChart()
        // 屏幕适配
        this.screenAdapter()
        // 渲染数据
        this.updateChart()
        },
    },
}
</script>

<style>

</style>