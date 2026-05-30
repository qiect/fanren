<template>
  <div ref="containerRef" class="w-full h-full relative">
    <svg ref="svgRef" class="w-full h-full"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'
import { useKnowledgeStore } from '@/stores/knowledge'
import { RELATIONSHIP_COLORS, FACTION_COLORS } from '@/types'

const store = useKnowledgeStore()
const containerRef = ref<HTMLDivElement>()
const svgRef = ref<SVGSVGElement>()

let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined> | null = null
let resizeObserver: ResizeObserver | null = null

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  name: string
  factionId: string
  cultivation: string
  radius: number
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  type: string
  description: string
}

const emit = defineEmits<{
  (e: 'selectCharacter', id: string): void
}>()

function getNodeRadius(cultivation: string): number {
  const map: Record<string, number> = {
    '化神期': 28,
    '元婴期': 22,
    '结丹期': 17,
    '筑基期': 13,
    '炼气期': 10,
    '凡人': 7,
  }
  return map[cultivation] || 8
}

function buildGraph() {
  if (!svgRef.value || !containerRef.value) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()

  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', 'rgba(201, 169, 110, 0.4)')

  const g = svg.append('g')

  const zoom = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoom)

  const chars = store.filteredCharacters
  const rels = store.filteredRelationships

  const charIds = new Set(chars.map(c => c.id))

  const nodes: GraphNode[] = chars.map(c => ({
    id: c.id,
    name: c.name,
    factionId: c.factionId,
    cultivation: c.cultivation,
    radius: getNodeRadius(c.cultivation),
    x: width / 2 + (Math.random() - 0.5) * 200,
    y: height / 2 + (Math.random() - 0.5) * 200,
  }))

  const links: GraphLink[] = rels
    .filter(r => charIds.has(r.sourceId) && charIds.has(r.targetId))
    .map(r => ({
      source: r.sourceId,
      target: r.targetId,
      type: r.type,
      description: r.description,
    }))

  simulation = d3.forceSimulation<GraphNode>(nodes)
    .force('link', d3.forceLink<GraphNode, GraphLink>(links)
      .id(d => d.id)
      .distance(100)
      .strength(0.3)
    )
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 8))

  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', d => RELATIONSHIP_COLORS[d.type as keyof typeof RELATIONSHIP_COLORS] || 'rgba(201,169,110,0.2)')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#arrowhead)')

  const nodeGroup = g.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .style('cursor', 'pointer')
    .call(d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation?.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation?.alphaTarget(0)
        d.fx = null
        d.fy = null
      })
    )

  nodeGroup.append('circle')
    .attr('r', d => d.radius)
    .attr('fill', d => FACTION_COLORS[d.factionId] || '#64748b')
    .attr('fill-opacity', 0.85)
    .attr('stroke', d => {
      if (d.id === 'hanli') return '#c9a96e'
      return 'rgba(255,255,255,0.15)'
    })
    .attr('stroke-width', d => d.id === 'hanli' ? 3 : 1)
    .attr('class', d => d.id === 'hanli' ? 'animate-pulse-gold' : '')

  nodeGroup.append('text')
    .text(d => d.name)
    .attr('dy', d => d.radius + 14)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(229, 231, 235, 0.8)')
    .attr('font-size', '11px')
    .attr('font-family', "'Noto Sans SC', sans-serif")
    .style('pointer-events', 'none')
    .style('text-shadow', '0 1px 3px rgba(0,0,0,0.8)')

  const tooltip = d3.select(containerRef.value!)
    .append('div')
    .style('position', 'absolute')
    .style('display', 'none')
    .style('padding', '8px 12px')
    .style('background', 'rgba(17, 24, 39, 0.95)')
    .style('border', '1px solid rgba(201, 169, 110, 0.3)')
    .style('border-radius', '8px')
    .style('font-size', '12px')
    .style('color', '#e5e7eb')
    .style('pointer-events', 'none')
    .style('z-index', '100')
    .style('backdrop-filter', 'blur(8px)')

  nodeGroup
    .on('mouseover', (event: MouseEvent, d: GraphNode) => {
      const char = store.getCharacterById(d.id)
      if (!char) return
      const faction = store.getFactionById(char.factionId)

      tooltip
        .style('display', 'block')
        .html(`
          <div style="font-weight:700;color:#c9a96e;margin-bottom:4px;">${char.name}</div>
          <div style="color:#9ca3af;font-size:11px;">${char.alias.length > 0 ? '别名：' + char.alias.join('、') : ''}</div>
          <div style="color:#9ca3af;font-size:11px;">境界：${char.cultivation}</div>
          <div style="color:#9ca3af;font-size:11px;">势力：${faction?.name || '无'}</div>
        `)

      link
        .attr('stroke-opacity', l => {
          const linkData = l as GraphLink
          const src = typeof linkData.source === 'string' ? linkData.source : (linkData.source as GraphNode).id
          const tgt = typeof linkData.target === 'string' ? linkData.target : (linkData.target as GraphNode).id
          return src === d.id || tgt === d.id ? 0.8 : 0.08
        })
        .attr('stroke-width', l => {
          const linkData = l as GraphLink
          const src = typeof linkData.source === 'string' ? linkData.source : (linkData.source as GraphNode).id
          const tgt = typeof linkData.target === 'string' ? linkData.target : (linkData.target as GraphNode).id
          return src === d.id || tgt === d.id ? 2.5 : 1
        })

      nodeGroup.select('circle')
        .attr('fill-opacity', n => {
          const node = n as GraphNode
          const isConnected = links.some(l => {
            const src = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id
            const tgt = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id
            return (src === d.id && tgt === node.id) || (tgt === d.id && src === node.id) || node.id === d.id
          })
          return isConnected ? 1 : 0.2
        })

      nodeGroup.select('text')
        .attr('fill-opacity', n => {
          const node = n as GraphNode
          const isConnected = links.some(l => {
            const src = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id
            const tgt = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id
            return (src === d.id && tgt === node.id) || (tgt === d.id && src === node.id) || node.id === d.id
          })
          return isConnected ? 1 : 0.15
        })
    })
    .on('mousemove', (event: MouseEvent) => {
      tooltip
        .style('left', (event.offsetX + 16) + 'px')
        .style('top', (event.offsetY - 8) + 'px')
    })
    .on('mouseout', () => {
      tooltip.style('display', 'none')
      link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5)
      nodeGroup.select('circle').attr('fill-opacity', 0.85)
      nodeGroup.select('text').attr('fill-opacity', 1)
    })
    .on('click', (_event: MouseEvent, d: GraphNode) => {
      emit('selectCharacter', d.id)
    })

  simulation.on('tick', () => {
    link
      .attr('x1', d => (d.source as GraphNode).x!)
      .attr('y1', d => (d.source as GraphNode).y!)
      .attr('x2', d => (d.target as GraphNode).x!)
      .attr('y2', d => (d.target as GraphNode).y!)

    nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`)
  })

  svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(0.8))
}

watch(
  () => [store.filteredCharacters, store.filteredRelationships],
  () => { buildGraph() },
  { deep: true }
)

onMounted(() => {
  buildGraph()
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => { buildGraph() })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  simulation?.stop()
  resizeObserver?.disconnect()
})
</script>
