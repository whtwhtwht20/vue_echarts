
<template>
  <div class="com-container">
      <div class="showTitle" :style="titleStyle">
          <span>{{'▏ ' + showTitle}}</span>
          <span class="iconfont showTitle-icon" @click="showChoice=!showChoice">&#xe6eb;</span>
          <div class="select-con" :style="marginStyle" v-show="showChoice" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item)">{{item.text}}</div>
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
            showTitle: '',
            showChoice: false,
            allData: [],
            choiceType: '',
            titleFontSize: 0
        }
    },
    computed: {
        selectTypes() {
            if (!this.allData.type) {
                return [];
            } else {
                return this.allData.type.filter(item => item.key != this.choiceType);
            }
        },
        titleStyle() {
            return {
                fontSize: + this.titleFontSize + 'px'
            }
        },
        marginStyle() {
            return {
                marginLeft: + this.titleFontSize + 'px'
            }
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
            const initOption = {
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
                }
            };
            this.chartInstance.setOption(initOption);
        },
        async getData() {
            const { data:ret } = await this.$axios.get('trend');
            this.allData = ret;
            const type = ret.type
            this.showTitle = type[0].text;
            this.choiceType = type[0].key;
            this.updataData();
        },
        updataData() {
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
            const timeData = this.allData.common.month;
            const seriesData = this.allData[this.choiceType].data.map((item,index) => {
                return {
                    
                    type: 'line',
                    stack: this.choiceType,
                    areaStyle: {
                        color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                            {
                                offset:0,
                                color: colorArr1[index]
                            },
                            {
                                offset:1,
                                color: colorArr2[index]
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: item.data,
                    name: item.name
                }
            })
            var dataOption = {
                xAxis : {
                    data: timeData
                },
                series: seriesData
            }
            this.chartInstance.setOption(dataOption);
            this.screenAdapter();
        },
        screenAdapter() {
            this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6; 
            var adapterOption = {
                legend: {
                    itemWidth: this.titleFontSize,
                    itemHeigth: this.titleFontSize,
                    itemGap: this.titleFontSize,
                    textStyle: {
                        fontSize: this.titleFontSize / 2
                    }
                }
            };
            this.chartInstance.setOption(adapterOption);
            this.chartInstance.resize();
        },
        handleSelect(item) {
            if (item.text != this.showTitle) {
                this.choiceType = item.key;
                this.showTitle = item.text;
                this.updataData(item.key);
            }
            this.showChoice=false;
        }
    }
}
</script>

<style lang="less" scoped>
.showTitle {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: white;
    .showTitle-icon {
        margin-left: 10px;
        cursor: pointer;
    }
    .select-con {
        background-color: #222733;
    }
}
</style>