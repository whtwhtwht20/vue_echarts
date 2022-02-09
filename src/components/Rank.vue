<template>
    <div class="com-container">
        <div class="com-chart" ref="rank_ref"></div>
    </div>
</template>

<script>
export default {
    name: 'Rank',
    data() {
        return {
            chartInstance: null,
            startValue: 0,
            endValue: 9,
            timeInterval: null
        }
    },
    created() {
        this.$socket.registerCallBack('rankData', this.getData);
    },
    mounted() {
        this.initData();
        // this.getData();
        this.$socket.send({
            action: 'getData',
            socketType: 'rankData',
            chartName: 'rank',
            value: ''
        });
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
        this.startInterval();
        this.chartInstance.on('mousemove', () => {
            console.log('1111');
            clearInterval(this.timeInterval);
        });
        this.chartInstance.on('mouseout', () => {
            this.startInterval();
        })
    },
    destroyed() {
        clearInterval(this.timeInterval);
        this.$socket.unRegisterCallBack('rankData');
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initData() {
            this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk');
            var initOption = {
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value'
                },
                title: {
                    text: '▏地区销售排行',
                    left: 20,
                    top: 20
                },
                grid: {
                    top: '40%',
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true
                },
                tooltip: {
                    show: true,
                    type: 'item'
                }
            }
            this.chartInstance.setOption(initOption);
            window.addEventListener('resize', this.screenAdapter)
        },
        getData(ret) {
            // const { data :ret } = await this.$axios.get('rank');
            this.allData = ret.sort((a,b) => b.value - a.value);
            this.updataChart();
        },
        updataChart() {
            const colorArr = [
                ['#0BA82C', '#4FF778'],
                ['#2E72BF', '#23E5E5'],
                ['#5052EE', '#AB6EE5']
            ]
            var timeData = this.allData.map(item => item.name);
            var valueData = this.allData.map(item => item.value);
            var dataOption = {
                dataZoom: {
                    show: false,
                    startValue: this.startValue,
                    endValue: this.endValue
                },
                xAxis: {
                    data: timeData
                },
                series: [
                    {
                        type: 'bar',
                        data: valueData,
                        itemStyle: {
                            color: arg => {
                                let targetColorArr = null;
                                if (arg.value > 200) {
                                    targetColorArr = colorArr[0];
                                } else if (arg.value > 100) {
                                    targetColorArr = colorArr[1];
                                } else {
                                    targetColorArr = colorArr[2];
                                }
                                return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                    {
                                        offset:0,
                                        color: targetColorArr[0]
                                    },
                                    {
                                        offset:1,
                                        color: targetColorArr[1]
                                    }
                                ]);
                            }
                        },
                    }
                ]
            }
            this.chartInstance.setOption(dataOption);
            
        },
        screenAdapter() {
            const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6;
            var adapterOption = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize,
                    }
                },
                series: [
                    {
                        itemStyle: {
                            barBorderRadius: [titleFontSize/2,titleFontSize/2,0,0]
                        },
                        barWidth: titleFontSize
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption);
            this.chartInstance.resize();
        },
        startInterval() {
            if (this.timeInterval) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            this.timeInterval = setInterval(() => {
                this.startValue++;
                this.endValue++;
                if (this.endValue > this.allData.length) {
                    this.startValue = 0;
                    this.endValue = 9;
                }
                this.updataChart();
            }, 2000);
        }
    }
}
</script>

<style>

</style>