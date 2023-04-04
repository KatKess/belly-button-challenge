//add API endpoint:
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Import API data
let data = d3.json(url).then(function(data){console.log(data)});

//Import Information.
function bellyInfo(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let metadata = sampleData.metadata;
        let identifier = metadata.filter(sample =>
            sample.id.toString() === id)[0];
            let sample = d3.select(`#sample-metadata`);
            sample.html('');
            Object.entries(identifier).forEach(([key, value]) => {
                sample.append('h6').text(`${key}: ${value}`);

            })
    })
};
// Create horizontal bat chart with dropdown menu to display top 10 OTUs.
//Use sample_values as values for the bat chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart. 
function Plot(id) {
    d3.json(url).then(function (data) {
        let sampleData = data;
        let samples = sampleData.samples;
        let identifier = samples.filter(SAMPLE => SAMPLE.ID === id);
        let filtered = identifier[0];
        let OTUvalues = filtered.sample_values.slice(0, 10).reverse();
        let OTUids = filtered.otu_ids.slice(0, 10).reverse();
        let labels = filtered.otu_labels.slice(0, 10).reverse();
        let barTrace = {
            x: OTUvalues,
            y: OTUids.map(object => 'OTU' + object),
            name: labels,
            type: 'bar',
            orientation: 'h'
        };
        let barLayout = {
            title: 'Top 10 OTUs for Subject $(id)',
            x_axis : {title: 'Sample Values'},
            y_axis : {title: 'OTU ID'}
        };

        let barData = [barTrace];
        Plotly.newPlot('bar', barData, barLayout);
        let bubbleTrace = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: 'markers',
            marker: {
                size: filtered.sample_values,
                color: filtered.otu_ids,
                colorscale: 'Portland'
        
            },
            text: filtered.otu_labels,
            
        };
        let bubbleData = [bubbleTrace];
        let bubbleLayout = {
            title: 'OTUs for Subject $(id)',
            x_axis: {title: 'OTU ID'},
            y_axis: {title: 'Sample Values'}
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    })
};

// When ID changes.
function optionChanged(id) {
    Plots(id),
    panelInfo(id);
};

// Code for Dropdown Screen. 
function init() {
    let dropDown = d3.select('#selDataset');
    let id = dropDown.property('value');
    d3.json(url).then(function (data) {
        sampleData = data;
        let names = sampleData.names;
        let samples = sampleData.samples;
        Object.values(names).forEach(value => {
            dropDown.append('option').text(value);
        })
        panelInfo(names[0]);
        Plots(names[0])
    })
};

init();
