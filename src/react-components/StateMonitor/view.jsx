import React from 'react'
import styles from './view.inject'

// {'\u25BC'}
// {'\u25B2'}

const isBasicType = input =>
  input === null ||
  input === undefined ||
  typeof input === 'string' ||
  typeof input === 'number' ||
  typeof input === 'boolean' ||
  typeof input === 'symbol'

const convertJSON = inputObj => {
  if (isBasicType(inputObj)) {
    return JSON.stringify(inputObj)
  }
  let str
  try {
    str = JSON.stringify(inputObj, null, 2)
  } catch (ex) {
    return <div style={{color: 'red', paddingLeft: '4px'}}>[Circular]</div>
  }
  let arr = str.split('\n').map((entry, index) => {
    const len = entry.length - entry.trimLeft().length
    return (
      <div style={{paddingLeft: `${len * 2}px`}} key={index}>{entry.trimLeft()}</div>
    )
  })

  return arr
}

const BasicEntry = props =>
  <div className={styles.stateDetailKey}>
    <span className={styles.keyValue}>{`${props.objKey}: `}</span><span className={styles.basicValue}>{convertJSON(props.obj)}</span>
  </div>

export class StateDetailObject extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isOpen: false }
    this.toggleOpen = this.toggleOpen.bind(this)
  }
  toggleOpen () {
    this.setState({ isOpen: !this.state.isOpen })
  }
  render () {
    return (
      isBasicType(this.props.obj)
        ? <BasicEntry {...this.props} />
        : <div className={styles.stateDetailKey}>
          <div className={styles.complexKey}>{`${this.props.objKey}: `}</div> {
            this.state.isOpen
              ? <div onClick={this.toggleOpen} className={styles.complexOpenClose}>{'\u25B2'}</div>
              : <div onClick={this.toggleOpen} className={styles.complexOpenClose}>{'\u25BC'}</div>
          }
          <div className={styles.complexValue}>{this.state.isOpen ? convertJSON(this.props.obj) : null}</div>
          <div className={styles.floatClear} />
        </div>
    )
  }
}

const StateDetail = props => {
  const keyList = Object.keys(props.nextState).sort().map((key, index) => {
    return (
      <StateDetailObject
        objKey={key}
        key={index}
        obj={props.nextState[key]}
      />
    )
  })
  return (
    <div>
      {keyList}
    </div>
  )
}

const DisplayStateDetail = props => {
  if (!props.displayModule) {
    return null
  }
  return (
    <div onClick={props.closeDisplayModule} className={styles.displayModuleContainerBackground}>
      <div onClick={(e) => { e.stopPropagation() }} className={styles.displayModuleContainer}>
        <div>
          <div className={styles.stateDetailTitle}>Display State Detail</div>
          <div title='Exit Display State.' onClick={props.closeDisplayModule} className={styles.transitionExitButton}>
            {'\u2716'}
          </div>
        </div>
        <div>
          <div className={styles.displayModuleText}>Module: <span className={styles.displayModuleTextValue}>{props.moduleName}</span></div>
          <div className={styles.displayModuleText}>Line Number: <span className={styles.displayModuleTextValue}>{props.lineNumber}</span></div>
          <div className={styles.displayModuleText}>Partition: <span className={styles.displayModuleTextValue}>{props.partitionName}</span></div>
          <div className={styles.displayModuleText}>Changed Keys:</div>
        </div>
        <div className={styles.displayStateObjectContainer}>
          <StateDetail nextState={props.nextState} />
        </div>
      </div>
    </div>
  )
}

export default class StateMonitor extends React.Component {
  componentDidUpdate () {
    if (this.monitorContentContainer) {
      if (!this.props.isDebugging) {
        this.monitorContentContainer.scrollTop = this.monitorContentContainer.scrollHeight
      } else {
        const elements = this.monitorContentContainer.getElementsByClassName(styles.dataRowOn)
        if (elements.length === 1) {
          // Make sure the on row is on the screen. Scroll if needed.
          if (elements[0].offsetTop < this.monitorContentContainer.scrollTop) {
            this.monitorContentContainer.scrollTop = elements[0].offsetTop
          } else if ((elements[0].offsetTop + elements[0].offsetHeight) > (this.monitorContentContainer.clientHeight + this.monitorContentContainer.scrollTop)) {
            this.monitorContentContainer.scrollTop = (elements[0].offsetTop + elements[0].offsetHeight) - this.monitorContentContainer.clientHeight
          }
        }
      }
    }
  }
  render () {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'mochaTesting' || process.env.NODE_ENV === 'mochaDebugTesting') {
      return null
    }
    const {startDebug, clickedState, backOneState, forwardOneState, stopDebug, replayStates, beginning, exit, minimize, maximize, setThisState, data, isDebugging, currentState, display, isMinimized} = this.props
    if (!display) {
      return null
    }

    if (isMinimized) {
      return (
        <div title='Maximize Monitor.' onClick={maximize} className={styles.maximizeButton}>
          <div className={styles.maximizeChar}>{'\u25A1'}</div>
        </div>
      )
    }
    const trlist = data.map((o, index) => {
      const theClass = currentState === index ? styles.dataRowOn : styles.dataRow
      return (
        <tr onClick={() => { clickedState(index) }} className={theClass} key={index}>
          <td className={styles.dataColumn}>{o}</td>
        </tr>
      )
    })
    const display1 = isDebugging ? 'none' : ''
    const display2 = !isDebugging ? 'none' : ''
    return (
      <div className={!isDebugging ? {} : styles.monitorContainerBackground}>
        <DisplayStateDetail {...this.props} />
        <div className={styles.monitorContainer}>
          <div>
            <div style={{ display: display1 }}>
              <div title='Start state debugging' onClick={startDebug} className={styles.transitionButton}>
                {'\u25b6'}
              </div>
              <div title='Minimize Monitor.' onClick={minimize} className={styles.transitionMinimizeButton}>
                {'\u2212'}
              </div>
              <div title='Exit Monitor.' onClick={exit} className={styles.transitionExitButton}>
                {'\u2716'}
              </div>
            </div>
            <div style={{ display: display2 }}>
              <div title='Move back one state.' onClick={backOneState} className={styles.transitionButton}>
                {'\u25c0'}
              </div>
              <div title='Move forward one state.' onClick={forwardOneState} className={styles.transitionButton}>
                {'\u25b6'}
              </div>
              <div title='Go to the start state.' onClick={beginning} className={styles.transitionReplayButton}>
                {'\u27F2'}
              </div>
              <div title='Execute states from beginning to end.' onClick={replayStates} className={styles.transitionReplayButton}>
                {'\u27f3'}
              </div>
              <div title='Set the store to this state and remove all others ahead of this one.' onClick={setThisState} className={styles.transitionReplayButton}>
                {'\u21a7'}
              </div>
              <div title='Stop debugging.' onClick={stopDebug} className={styles.transitionStopButton}>
                {'\u25FC'}
              </div>

            </div>
          </div>
          <div ref={(div) => { this.monitorContentContainer = div }} className={styles.monitorContentContainer}>
            <table>
              <tbody>
                {trlist}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
