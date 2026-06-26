type PanelStateProps = {
  title: string
  compact?: boolean
}

function PanelState({ title, compact = false }: PanelStateProps) {
  return <div className={`panel-state${compact ? ' compact' : ''}`}>{title}</div>
}

export default PanelState