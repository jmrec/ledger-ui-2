import { boot } from 'quasar/wrappers'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
    TitleComponent, TooltipComponent, LegendComponent, GridComponent
} from 'echarts/components'

// Register components
use([
    CanvasRenderer, LineChart, BarChart, PieChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent
])

export default boot(({ app }) => {
    app.component('v-chart', ECharts)
})
