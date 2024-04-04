'use client';
import { useEffect, useState } from 'react'
import * as d3 from 'd3';
import stateData from "./../data/states.json";

export interface USAMapProps {
  onStateSelected?: (state: string) => void;
  onPowerPlantSelected?: (powerplant: any) => void;
  markers?: any[];
}

export default function USAMap({ onStateSelected, onPowerPlantSelected, markers = [] as any[] }: USAMapProps) {
  const [selectedState, setSelectedState] = useState("All");
    const mapRatio = 0.5

    const margin = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    }

    function sendStateSelectedEvent(stateName: string) {
      setTimeout(() => {
        setSelectedState(stateName);
        onStateSelected && onStateSelected(stateName)
      }, 800);
    }

    function convertPowerPlantNetGeneration(powerplant: any) {
      const netGeneration = powerplant.PLNGENAN;
      if (netGeneration > 1000000) {
        return `${(netGeneration / 1000000).toFixed(2)} TWh`;
      } if (netGeneration > 1000) {
        return `${(netGeneration / 1000).toFixed(2)} GWh`;
      } else {
        return `${netGeneration} MWh`;
      }
    }
  
    
    useEffect(() => {
        let width = parseInt(d3.select('.us-map').style('width'))
    
        let height = width * mapRatio
        let active = d3.select(null);
    
        width = width - margin.left - margin.right

        d3.select('.us-map').selectAll('svg').remove();
    
        const svg = d3.select('.us-map').append('svg')
          .attr('class', 'center-container')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right);
    
        svg.append('rect')
          .attr('class', 'background center-container')
          .attr('height', height + margin.top + margin.bottom)
          .attr('width', width + margin.left + margin.right)
    
        const projection = d3.geoAlbersUsa()
          .translate([width / 2, height / 2])
          .scale(width);
    
        const pathGenerator = d3.geoPath()
          .projection(projection);
    
        const g = svg.append("g")
          .attr('class', 'center-container center-items us-state')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
    
    
        g.append("g")
          .attr("id", "states")
          .selectAll("path")
          .data(stateData.features)
          .enter()
          .append("path")
          .attr("key", feature => {
            return feature.properties.NAME
          })
          .attr("d", (feature: any) => pathGenerator(feature))
          .attr("class", "state")
          .attr("fill", "#E9E3DA")
          .on("click", selectState)

        function selectState(this: any, event: PointerEvent, stateFeature: any) {
            event.stopPropagation();
            if (active.node() === this) {
              sendStateSelectedEvent("All")
              return resetZoom();
            }
            
            sendStateSelectedEvent(stateFeature.properties.NAME)
            active.classed("active", false);
            active = d3.select(this).classed("active", true);

            zoomIn(stateFeature)
        }
    
        function zoomIn(currentState: any) {
          let bounds = pathGenerator.bounds(currentState);
    
          let dx = bounds[1][0] - bounds[0][0];
          let dy = bounds[1][1] - bounds[0][1];
    
          let x = (bounds[0][0] + bounds[1][0]) / 2;
          let y = (bounds[0][1] + bounds[1][1]) / 2;
    
          let scale = .9 / Math.max(dx / width, dy / height);
          let translate = [width / 2 - scale * x, height / 2 - scale * y];
    
          g.transition()
            .duration(750)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }
    
        function resetZoom() {
          active.classed("active", false);
          active = d3.select(null);

          g.transition()
            .delay(100)
            .duration(750)
            .style("stroke-width", "1.5px")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        }
    }, []);

    useEffect(() => {
      let width = parseInt(d3.select('.us-map').style('width'));
      let height = width * mapRatio;
      width = width - margin.left - margin.right;
  
      const projection = d3.geoAlbersUsa()
          .translate([width / 2, height / 2])
          .scale(width);
  
      const svg = d3.select('.us-map').select('svg');
      const state = svg.select('.us-state');
  
      // Remove existing marks and text
      state.selectAll('.mark').remove();
      state.selectAll('.mark-text').remove();
  
      // Append new marks
      const marks = state.selectAll('.mark')
          .data(markers)
          .enter()
          .append("g")
          .attr('class', 'mark')
          .attr('transform', function(marker) {
              const [x, y] = projection([marker.LON, marker.LAT]) as [number, number];
              return 'translate(' + x + ',' + y + ')';
          })
          .on('click', function(event, marker) {
            event.stopPropagation();
            onPowerPlantSelected && onPowerPlantSelected(marker);
          });

          const imageSize = selectedState === "All" ? 20 : 4;
          const yDistance = selectedState === "All" ? 22 : 5;
          const fontSize = selectedState === "All" ? "10px" : "2px";
      // Append image to each mark
      marks.append("image")
          .attr('width', imageSize)
          .attr('height', imageSize)
          .attr('x', -(imageSize/2)) // Adjust this value to position the text relative to the marker image
          .attr('y', -(imageSize/2)) // Adjust this value to position the text relative to the marker image
          .attr('xlink:href', './powerplant.png');
  
      // Append text to each mark
      marks.append('text')
          .attr('class', 'mark-text')
          .attr('x', 0) // Adjust this value to position the text relative to the marker image
          .attr('y', yDistance) // Adjust this value to position the text relative to the marker image
          .style('text-anchor', 'middle')
          .style('font-size', fontSize)
          .text((marker) => `${marker.PNAME}
          (${convertPowerPlantNetGeneration(marker)})`);
  
  }, [markers, margin.left, margin.right, selectedState, onPowerPlantSelected]);
      
    return (
        <div className="us-map bg-white shadow rounded">
        </div>
    )
}