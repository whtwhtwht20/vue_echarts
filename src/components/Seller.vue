
<template>
  <div class="com-container">
      <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Seller',
    data() { 
        return {
            chartInstance: null,
            allData: [],
            currentPage: 1,
            totalPage: 0,
            timeId: null
        }
    },
    created() {
        this.$socket.registerCallBack('sellerData', this.getData);
    },
    mounted() {
        this.initChart();
        // this.getData();
        this.$socket.send({
            action: 'getData',
            socketType: 'sellerData',
            chartName: 'seller',
            value: ''
        });
        window.addEventListener('resize', this.screenAdapter);
        this.screenAdapter();
    },
    methods: {
        // 初始化echartsInstance对象
        initChart() {
            this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme);
            this.chartInstance.on('mousemove', () => {
                if (this.timeId) {
                    clearInterval(this.timeId);
                    this.timeId = null;
                }
            });
            this.chartInstance.on('mouseout', () => {
                if (!this.timeId) this.startInterval();
            });
            var initOpntion = {
                title: {
                    text: '▏ 商家销售量统计',
                    textStyle: {
                        color: 'white',
                    },
                    top: '3%',
                    left: '8%'
                },
                grid: {
                    top: '20%',
                    left: '3%',
                    right: '6%',
                    bottom: '3%',
                    // 默认grid不包含坐标轴文字，改为true
                    containLabel: true,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer:{
                        type: 'line',
                        z: 0,
                        lineStyle: {
                            color: '#2D3443'
                        }
                    }
                },
                xAxis: {
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            color: 'white'

                        },
                        itemStyle: {
                            // color: {
                            //     type: 'linear',
                            //     x: 0,
                            //     y: 0,
                            //     x2: 0,
                            //     y2: 1,
                            //     colorStops: [{
                            //     offset: 0, color: 'rgba(58,132,255, 0.5)'    // 0% 处的颜色
                            //     },{
                            //     offset: 1, color: 'rgba(58,132,255, 0)' //   100% 处的颜色
                            //     }],
                            //     global: false // 缺省为 false
                            // },
                            color: new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                                {
                                    offset:0,
                                    color:'#5052EE'
                                },
                                {
                                    offset:1,
                                    color:'#AB6EE5'
                                }
                            ]),
                        },
                        barWidth: '50%',
                    }
                ] 
            }
            this.chartInstance.setOption(initOpntion);
        },
        // 获取服务器的数据
        getData(ret) {
            // const {data: ret} = await this.$axios.get('seller');
            this.allData = ret;
            this.allData.sort((a,b) => {
                return b.value - a.value;
            });
            this.totalPage = this.allData.length % 5 == 0 ? this.allData.length / 5 : this.allData.length / 5 + 1;
            this.updateChart();
            this.startInterval()
        },
        // 更新图表
        updateChart() {
            const start = (this.currentPage - 1) * 5 ;
            const end = this.currentPage * 5;
            const showData = this.allData.slice(start, end);
            const sellerVaule = [];
            const sellerName = [];
            showData.forEach((item) => {
                sellerVaule.push(item.value);
                sellerName.push(item.name);
            })
            var dataOpntion = {
                yAxis: {
                    data: sellerName
                },
                series: [
                    {
                        data: sellerVaule,
                    }
                ] 
            }
            this.chartInstance.setOption(dataOpntion);
           
        },
        //每隔3秒定时切换
        startInterval(){
            if (this.timeId) return
            this.timeId = setInterval(() => {
                if (this.totalPage > this.currentPage) {
                    this.currentPage++;
                } else {
                    this.currentPage = 1;
                }
                this.updateChart();
            },3000)
        },
        // 适配配置处理
        screenAdapter() {
            const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6;
            var adapterOpntion = {
                title: {
                    textStyle: {
                        fontSize: titleFontSize
                    },
                },
                tooltip: {
                    axisPointer:{
                        lineStyle: {
                            width: titleFontSize,
                        }
                    }
                },
                series: [
                    {
                        itemStyle: {
                            barBorderRadius: [0,titleFontSize/2,titleFontSize/2,0]
                        },
                        barWidth: titleFontSize,
                    }
                ] 
            }
            this.chartInstance.setOption(adapterOpntion);
            this.chartInstance.resize();
        }
    },
    destroyed() {
        clearInterval(this.timeId);
        removeEventListener('resize', this.screenAdapter);
        this.chartInstance.off('mousemove');
        this.chartInstance.off('mouseout');
        this.$socket.unRegisterCallBack('sellerData');
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