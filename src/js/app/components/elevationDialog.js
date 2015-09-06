var React = require("react");

var Reflux      = require('reflux');
var ServiceStore = require('../stores/ServiceStore');
var Actions     = require('../actions');

var Highcharts = require('highcharts-commonjs');

var utility = require('../utility');

var mui = require('material-ui'); 
var Dialog = mui.Dialog;
var FlatButton = mui.FlatButton;

var ElevationDialog = React.createClass({

  	getInitialState: function() {

        return {

        };

  	},

    getCharConfig: function(dataArray) {

        return {
            chart: {
                zoomType: null,
                spacing: [10,0,0,0],
                animation: false,
                reflow: false
            },
            tooltip: {
                enabled: false,
                followPointer: false,
                followTouchMove: false,
                animation: false
            },
            title: {
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                type: 'linear',
                labels: {
                    enabled: false
                },
            },
            yAxis: {
                title: {
                    enabled: false
                },
                labels: {
                    enabled: true,
                    formatter: function() {
                        return utility.toFeet(this.value);
                    },
                    align: 'left',
                    x: 0,
                    y: -2
                },
                minPadding: 0
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    /*fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },*/
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'area',
                data: dataArray,
                animation: false,
                enableMouseTracking: false
            }]/*,
            {
                type: 'area',
                data: trackElevationProgress
            }
            ]*/
        };

    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (this.props.excursion && !nextProps.excursion) return true;
        return (!this.props.excursion && nextProps.excursion) ||
            (this.props.excursion && this.props.excursion.name !== nextProps.excursion.name);
    },

    componentDidUpdate: function() {

    },

    dismissDialog: function() {
        this.refs.dialog.dismiss();
    },

    onDialogShow: function() {
        
        console.log('onDialogShow');

        //make sure excursion is present and chart target div has been rendered
        if (this.props.excursion && this.props.excursion.gpx && Object.keys(this.props.excursion.gpx).length && this.refs.highchartRenderContainer) {
            
            //get elevation property of first gpx file from excursion in this.props.excursion
            var gpxElevationEntry = this.props.excursion.gpx[Object.keys(this.props.excursion.gpx)[0]].elevation;

            Highcharts.createChart(
                this.refs.highchartRenderContainer.getDOMNode(),
                this.getCharConfig(gpxElevationEntry),
                function() {
                    console.log('Chart initialized');
                }
            );

        } //else delete this.chart;

    },

    render: function() {

        console.log('ElevationDialog render');

        //styles
        var style = {
            highchartDialogContainer: {
                padding: 10
            },
            highchartRenderContainer: {
                width: '100%',
                height: 200,
                margin: '0 auto'
            }
        };

        //Custom Actions
        var customActions = [
          <FlatButton
            key="close"
            label="Close"
            onTouchTap={this.dismissDialog} />
        ];
 
        return (
            <div>
                <Dialog 
                    ref="dialog" 
                    title="Elevation Profile" 
                    onShow={this.onDialogShow} 
                    actions={customActions} 
                    autoDetectWindowHeight={true} 
                    autoScrollBodyContent={true}
                    contentInnerStyle={style.highchartDialogContainer} > 
                        <div id="highchartRenderContainer" ref="highchartRenderContainer" style={style.highchartRenderContainer}></div>
                </Dialog>
            </div>
        );

    }
});

module.exports = ElevationDialog;

