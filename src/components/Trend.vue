
<template>
  <div class="com-container">
      <div class="title">
          <span>{{title}}</span>
          <span class="iconfont title-icon" @click="iconStatus=!iconStatus">&#xe6eb;</span>
          <div v-show="iconStatus" v-for="item in selectArr" :key="item.key" @click="contentChange(item)">{{item.text}}</div>
      </div>
      <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
    name: 'Trend',
    data() {
        return {
            chartInstance: null,
            selectArr: [],
            title: '',
            iconStatus: false
        }
    },
    mounted() {
        this.initData();
        this.getData();
        window.addEventListener('resize', this.screenAdapter);
    },
    destroyed() {
        window.removeEventListener('resize', this.screenAdapter);
    },
    methods: {
        initData() {
            this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk');
            const colorArr1 = [
                'rgba(11, 168, 44, 0.5)',
                'rgba(44, 110, 255, 0.5)',
                'rgba(22, 242, 217, 0.5)',
                'rgba(254, 33, 30, 0.5)',
                'rgba(250, 105, 0, 0.5)'
            ]
            const colorArr2 = [
                'rgba(11, 168, 44, 0)',
                'rgba(44, 110, 255, 0)',
                'rgba(22, 242, 217, 0)',
                'rgba(254, 33, 30, 0)',
                'rgba(250, 105, 0, 0)'
            ]
            const initOption = {
                // title:{
                //     text: '▕ 地区销量趋势',
                //     textStyle: {
                //         color: 'white',
                //         fontSize: 66
                //     },
                //     left: '3%',
                //     top: '3%'
                // },
                legend: {
                    type: 'plain',
                    show: true,
                    left: 20,
                    top: '15%',
                    icon: 'circle',
                    textStyle: {
                        fontSize: 30
                    }
                },
                grid: {
                    top: '35%',
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                xAxis : {
                    type: 'category',
                    boundaryGap:false
                },
                yAxis : {
                    type: 'value'
                },
                series: [
                    {
                        type: 'line',
                        stack: 'area',
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                {
                                    offset:0,
                                    color: colorArr1[0]
                                },
                                {
                                    offset:1,
                                    color: colorArr2[0]
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                    },
                    {
                        type: 'line',
                        stack: 'area',
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                {
                                    offset:0,
                                    color: colorArr1[1]
                                },
                                {
                                    offset:1,
                                    color: colorArr2[1]
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                    },
                    {
                        type: 'line',
                        stack: 'area',
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                {
                                    offset:0,
                                    color: colorArr1[2]
                                },
                                {
                                    offset:1,
                                    color: colorArr2[2]
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                    },
                    {
                        type: 'line',
                        stack: 'area',
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                {
                                    offset:0,
                                    color: colorArr1[3]
                                },
                                {
                                    offset:1,
                                    color: colorArr2[3]
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                    },
                    {
                        type: 'line',
                        stack: 'area',
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                                {
                                    offset:0,
                                    color: colorArr1[4]
                                },
                                {
                                    offset:1,
                                    color: colorArr2[4]
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        }
                    },
                ]
            };
            this.chartInstance.setOption(initOption);
        },
        async getData(key) {
            const { data:ret } = await this.$axios.get('trend');
            this.allData = ret;
            this.selectArr = ret.type;
            this.updataData();
        },
        updataData(key) {
            const xData = this.allData.common.month;
            let yData = [];
            if (key == 'commodity') {
                yData = this.allData.commodity.data;
                this.title = this.allData.type[2].text;
            } else if (key == 'seller') {
                yData = this.allData.seller.data;
                this.title = this.allData.type[1].text;
            } else {
                yData = this.allData.map.data;
                this.title = this.allData.type[0].text;
            }
            var dataOption = {
                xAxis : {
                    data: xData
                },
                series: yData
            }
            this.chartInstance.setOption(dataOption);
            this.screenAdapter();
        },
        screenAdapter() {
            var adapterOption = {

            };
            this.chartInstance.setOption(adapterOption);
            this.chartInstance.resize();
        },
        contentChange(item) {
            if (item.text != this.title) {
                this.updataData(item.key);
            }
            this.iconStatus=false;
        }
    }
}
</script>

<style lang="less" scoped>
.title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: white;
    .title-icon {
        margin-left: 10px;
        cursor: pointer;
    }
}
</style>